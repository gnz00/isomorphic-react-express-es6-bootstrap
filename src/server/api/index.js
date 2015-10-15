import { Router } from 'express';

export default function() {
  var api = Router();

  // Register API routes here
  api.get('/', (req, res) => {
    return res.json({
      version : '0.0'
    });
  });

  return api;
}();