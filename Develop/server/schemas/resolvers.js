const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, args) => {
            const foundUser = await User.findOne({
                $or: [{ _id: args.id }, { username: args.username }],
            });
            return foundUser;
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            try {
                const user = await User.create(args);
                const token = signToken(user);
                return { token, user };
            } catch {
                console.log(err);
            }
        },
        login: async (parent, args) => {
            const user = await User.findOne({
                $or: [{ username: args.username }, { email: args.email }],
            });
            if (!user) {
                return console.log('Invaild credentials');
            }
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) {
                return console.log('Invaild credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args) => {
            console.log(args);
            try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: args._id },
                { $addToSet: { savedBooks: args.body } },
                { new: true, runValidators: true }
            );
            return updatedUser;
            } catch (err) {
            return console.log(err);
            }
        },
        deleteBook: async (parent, args) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: args._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
              );
              if (!updatedUser) {
                return console.log("Couldn't find user with this id!");
              }
              return updatedUser;
        },
    }
}

module.exports = resolvers;