<template>
    <el-container>
        <el-header >
        </el-header>
        <el-main>
            <div class="container-center">
                <div>Welcome to enamel! Finish setting up your account</div>
                <div v-if="error" class="error">
                    {{ error }}
                </div>
                <el-form ref="form" :model="form">
                    <el-form-item>
                        <el-input v-model="form.firstname" placeholder="Your first name"></el-input>
                        <el-input v-model="form.lastname" placeholder="Your last name"></el-input>
                        <el-input v-model="form.password" type="password" placeholder="Password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="signup">Complete</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import { Signup } from  '../constants/query.gql'
    export default {
        data () {
            name: 'Signup'
            return {
                form: {
                    firstname: '',
                    lastname: '',
                    password: ''
                },
                error: false
            }
        },
        methods: {
            async signup() {
                // this.$apollo.provider.clients.defaultClient.cache.reset()
                const {firstname, lastname, password} = this.form
                if (!firstname && !lastname && !password) {
                    this.error = 'Please complete the form'
                    return
                }
                this.$apollo.mutate({
                    mutation: Signup,
                    variables: {
                        id: this.$route.params.id,
                        firstname,
                        lastname,
                        password
                    }
                }).then(({data}) => {
                    console.log('data', data)
                    const id = data.signup.user.id
                    const token = data.signup.token
                    this.saveUserData(id, token)
                    this.$router.push({name: 'workspace'})
                }).catch((error) => {
                    this.error = 'Something went wrong'
                    console.log(error)
                })
            },
            saveUserData(id, token) {
                localStorage.setItem('user-id', id)
                localStorage.setItem('user-token', token)
                this.$root.$data.userId = localStorage.getItem('user-id')
            }
        }
    }
</script>>
<style scoped>
    .el-button {
        width: 100%;
    }
    .el-input {
        padding-top: 30px;
    }
    .error {
        padding-top: 10px;
    }
</style>