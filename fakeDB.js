const database = {
  users: [
    {
      id: "1",
      email: "gates@gmail.com",
      password: "gates123",
      username: "billgates",
      Posts: [
        {
          postId: "abc1",
        },
      ],
      following: [],
    },
    {
      id: "2",
      username: "james123",
      email: "james123@gmail.com",
      password: "james123",
      posts: [
        {
          postId: "abc1",
        },
      ],
      following: [],
    },
  ],

  posts: [
    {
      postId: "abc1",
      player1: "billgates",
      player2: "james123",
      category: "dance",
      description: "Microsoft is a nice company",
      createdAt: new Date(),
      p1UploadID: "1",
      p2UploadID: "1",
      comments: 0,
      commentList: [
        {
          id: "abc2",
          createdAt: new Date(),
          userId: "billgates",
          message: "this is some random comment",
        },
      ],
    },
  ],

  uploads: [{ id: "1", url: "blablh.combucket", Likes: 2 }],
};

module.exports = { database };
