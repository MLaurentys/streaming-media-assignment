const fs = require('fs'); // pull in the file system module
const path = require('path');

function respondError(res, err) {
  if (err.code === 'ENOENT') res.writeHead(404);
  return res.end(err);
}

function getByteRange(byteRange, fileSize) {
  const byteStr = byteRange || 'bytes=0-';
  const positions = byteStr.replace(/bytes=/, '').split('-');
  let start = parseInt(positions[0], 10);
  const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
  if (start > end) {
    start = end - 1;
  }
  return [start, end];
}

function writeHeaderSuccess(res, start, end, fileSize, contentType) {
  const chunksize = end - start + 1;
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': contentType,
  });
}

function respondFile(req, res, filename, contentType) {
  const file = path.resolve(__dirname, filename);
  fs.stat(file, (err, stats) => {
    if (err) return respondError(res, err);
    const [start, end] = getByteRange(req.headers.range, stats.size);
    writeHeaderSuccess(res, start, end, stats.size, contentType);
    const stream = fs.createReadStream(file, { start, end });
    stream.on('open', () => {
      stream.pipe(res);
    });
    stream.on('error', (streamErr) => {
      res.end(streamErr);
    });
    return stream;
  });
}

const getParty = (req, res) => {
  respondFile(req, res, '../client/party.mp4', 'video/mp4');
};

function getBling(req, res) {
  respondFile(req, res, '../client/bling.mp3', 'audio/mp3');
}

function getBird(req, res) {
  respondFile(req, res, '../client/bird.mp4', 'video/mp4');
}

module.exports = { getParty, getBling, getBird };
