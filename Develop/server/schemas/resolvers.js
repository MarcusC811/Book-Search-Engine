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
    }
}

module.exports = resolvers;