const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const User = require('../model/user');
const Post = require('../model/post');
const Hobby = require('../model/hobby');

// Dummy Data

// const usersData = [
//     {id: '1', name: 'Bond', age: 36, profession: 'Programmer'},
//     {id: '2', name: 'Anna', age: 27, profession: 'Designer'},
//     {id: '3', name: 'Bella', age: 18, profession: 'Artist'},
//     {id: '4', name: 'Gina', age: 45, profession: 'Teacher'},
//     {id: '5', name: 'Georgina', age: 54, profession: 'Actor'}
// ]

// Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                console.log(parent._id);
                return Hobby.find({});
            }
        }
    })
});

// const hobbiesData = [
//     {userId: '5', id: '1', title: 'Programming', description: 'Programming Hobby'},
//     {userId: '4', id: '2', title: 'Rowing', description: 'Rowing Hobby'},
//     {userId: '3', id: '3', title: 'Swimming', description: 'Swimming Hobby'},
//     {userId: '2', id: '4', title: 'Fencing', description: 'Fencing Hobby'},
//     {userId: '1', id: '5', title: 'Hiking', description: 'Hiking Hobby'},
// ]

// const postsData = [
//     {id: '1', comment: "Comment 1", userId: '5'},
//     {id: '2', comment: "Comment 2", userId: '4'},
//     {id: '3', comment: "Comment 3", userId: '3'},
//     {id: '4', comment: "Comment 4", userId: '2'},
//     {id: '5', comment: "Comment 5", userId: '1'},
// ]

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby Description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post Description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        }
    })
});

// Scalar Type

// RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return User.findById(args.id)
            }},
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Hobby.findById(args.id);
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({});
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        }
        
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID}
                name: {type: new GraphQLNonNull(GraphQLString)},
                profession: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},

            },
            resolve(parent, args) {
                let user = new User( {
                    name: args.name,
                    profession: args.profession,
                    age: args.age
                });
                user.save();
                return user;
            }
        },

        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                profession: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, {id, name, profession, age}) {
                return updatedUser = User.findByIdAndUpdate(id, {
                    $set: 
                    {
                        name,
                        profession,
                        age
                    },
                }, 
                {new: true} //send back the updated objectType
                )
            }
        },

        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, {id}) {
                const deletedUser = User.findByIdAndRemove(id).exec();
                if (!deletedUser) {
                    throw new Error('Error');
                }
            }
        },

        createPost: {
            type: PostType,
            args: {
                // id: {type: GraphQLID}
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                });
                post.save();
                return post;
            }
        },

        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                comment: {type: new GraphQLNonNull(GraphQLString)},
                // userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, {id, comment}) {
                return updatedPost = Post.findByIdAndUpdate(id, {
                    $set: {comment}
                }, {new: true})
            }
        },

        deletePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, {id}) {
                const deletedPost = Post.findByIdAndRemove(id).exec();
                if(!deletedPost) {
                    throw new Error('Failed to delete the Post');
                }
            }
        },

        createHobby: {
            type: HobbyType,
            args: {
                // id: {type: GraphQLID}
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                });

                hobby.save();

                return hobby;
            }
        },

        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, {id, title, description}) {
                return updateHobby = Hobby.findByIdAndUpdate(id, {
                    $set: {
                        title,
                        description
                    }
                }, {new: true});
            }
        },
        deleteHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, {id}) {
                const deletedHobby = Hobby.findByIdAndRemove(id).exec();
                if(!deletedHobby) {
                    throw new Error('Failed to delete the Hobby');
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});