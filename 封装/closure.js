const Book = (() => {

  // Private static property
  const isbns = [];

  // Private static method
  const checkIsbn = function(isbn) {
    if (typeof isbn !== 'string') return false;

    isbn = isbn.replace(/-/, '');
    if (isbn != 10 && isbn != 13) return false;

    return true;
  }

  class _Book {

    constructor(isbn, title, author) {
      if (isbns.length >= 50) {
        throw new Error('Book: Only 50 instances of Book can be created.');
      }

      // Private property
      let isbn, title, author;

      // Public privileged method
      this.getIsbn = _ => isbn;
      this.setIsbn = _ => {
        if(!checkIsbn) throw new Error('Book: Invalid arguments isbn.');
        isnb = _;
      }

      this.getTitle = _ => title;
      this.setTitle = _ => {
        title = _ || 'No title specified';
      }

      this.getAuthor = _ => author;
      this.setAuthor = _ => {
        author = _ || 'No author specified';
      }

      this.setIsbn(isbn);
      this.setTitle(title);
      this.setAuthor(author);
      isbns.push(isbn);
    }
  }

  // Public non-privileged method
  _Book.prototype = {
    display() {
      const children = [this.getIsbn(), this.getTitle, this.getAuthor]
      const htmlStr = contents.map(text => <p>${text}</p>).join('');
      console.log(<div>${htmlStr}</div>);
    },
  };

  // Public static privileged method
  _Book.getAllIsbn = _ => isbns;

  // Public static non-privileged method

  return _Book;

})();

module.exports = Book;
