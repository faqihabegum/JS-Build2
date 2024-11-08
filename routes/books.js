const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
const router =express.Router();
router.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Got All Books",
        data:books,
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book Not Found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Found The Book By Their id",
    data: book,
  });
});
router.get("/issued/by-user", (req, res) => {
  const usersWithTheIssuedBook = users.filter((each) => {
    if (each.issuedBook) return each;
  });
  const issuedBooks = [];
  usersWithTheIssuedBook.forEach((each) => {
    const book = books.find((book) => book.id === each.issuedBook);
    book.issuedBy = each.name;
    book.issuedDate = each.issuedDate;
    book.returnDate = each.returnDate;
    issuedBooks.push(book);
  });
  if (issuedBooks.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No Book Have Been Issued Yet..",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Users With The Issued Books..",
    data: issuedBooks,
  });
});

router.post("/",(req,res)=>{
  const {data} = req.body;
  if(!data){
    return res.status(200).json({
      success: false,
      message:"No Data To Add A Book"
    });
  }
  
  const book = books.find((each)=> each.id === data.id);
  if (book){
    return res.status(404).json({
      success:false,
      message:"Id Already Exists !!",
    });
  }
  const allBooks =  {...books, data };
  return res.status(201).json({
    success: true,
    message: "Added Book Succesfully",
    data: allBooks,
  });
});
router.put("/updateBook/:id",(req,res)=>{
  const {id} =req.params;
  const {data} = req.body;
  const book = books.find((each)=> each.id === id)
  if(!book){
    return res.status(400).json({
      success: false,
      message:"Book Not Found By This ID",   
 });
  } 
  const updateData = books.map((each)=>{
    if(each.id === id){
    return {...each, ...data}
  }
    return each;
  });
  return res.status(200).json({
    success: true,
   message: "Updated A Book By Their ID",
   data: updateData,
  });
});


module.exports = router;