import express from 'express';
const router = express.Router();
 

router.get('/userInfo', (req, res) => {
  res.json({
    id: 1,
    name: 'John Doe',
    age: 30
  });
});
router.get('/posts', (req, res) => {
  res.json([
    { id: 1, title: 'Post 1', content: 'This is the content of post 1' },                   
    { id: 2, title: 'Post 2', content: 'This is the content of post 2' },
    { id: 3, title: 'Post 3', content: 'This is the content of post 3' }
  ]);
});
 
export default router;