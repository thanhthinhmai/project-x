const { GraphQLScalarType } = require('graphql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const { User, Team } = require('./models')
const JWT_SECRET = process.env.JWT_SECRET
const { getUserId } = require('./utils')

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())]
}

const avatarColor = [
    "D81B60","F06292","F48FB1","FFB74D","FF9800","F57C00","00897B","4DB6AC","80CBC4",
    "80DEEA","4DD0E1","00ACC1","9FA8DA","7986CB","3949AB","8E24AA","BA68C8","CE93D8"
]
const resolvers = {
    Query: {
        async getTeam(_, args, context) {
            const userId = getUserId(context)
            const user = await User.findById(userId)
            return await Team.findById(user.team)
        }
    },
    Mutation: {
        async captureEmail(_, {email}) {
            const isEmailTaken = await User.findOne({email})
            if (isEmailTaken) {
                throw new Error('This email is already taken')
            }
            const user = await User.create({
                email,
                role: 'Owner',
                status: 'Pending'
            })
            return user
        },
        async signup (_, {id, firstname, lastname, password}) {
            const user = await User.findById(id)
            const common = {
                firstname,
                lastname,
                name: `${firstname} ${lastname}`,
                avatarColor: randomChoice(avatarColor),
                password: await bcrypt.hash(password, 10),
                status: 'Active'
            }
            if (user.role === 'Owner') {
                const team = await Team.create({
                    name: `${common.name}s Team`
                })
                user.set({
                    ...common,
                    team: team.id,
                    jobTitle: 'CEO/Owner/Founder'
                })
            } else {
                user.get(common)
            }
            await user.save()
            const token = jwt.sign({
                id: id,
                email: user.email
            }, JWT_SECRET)
            return { token, user }
        },
        async login (_, {email, password}) {
            const user = await User.findOne({ email })
            if (!user) {
                throw new Error('No user with that email')
            }
            const valid = await bcrypt.compare(password, user.password)
            if (!valid) {
                throw new Error('Incorrect password')
            }
            const token = jwt.sign({id: user.id, email}, JWT_SECRET)
            return {token, user}
        }
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue: (value) => moment(value).toDate(), // value from the client
        serialize: (value) => value.getTime(), // value sent to the client
        parseLiteral: (ast) => ast
    })
}

module.exports = resolvers