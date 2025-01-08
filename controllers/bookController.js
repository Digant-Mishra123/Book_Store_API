let books = [];
let bookIdCounter = 1;

export const createBook = (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  const newBook = { id: bookIdCounter++, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
};
export const getAllBooks = (req, res) => {
  res.json(books);
};
export const updateBook = (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const { title, author } = req.body;
  const book = books.find((b) => b.id === bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  if (title) book.title = title;
  if (author) book.author = author;
  res.json(book);
};
export const deleteBook = (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  books.splice(bookIndex, 1);
  res.status(204).send();
};