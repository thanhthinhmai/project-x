<template>
    <el-container>
        <el-header>
        </el-header>
        <el-main>
            <div class="container-center">
                <h2>Log in</h2>

                <div v-if="error" class="error">
                    {{ error }}
                </div>
                <el-form ref="form" :model="form">
                    <el-form-item>
                        <el-input v-model="form.email" placeholder="Email"></el-input>
                        <el-input v-model="form.password" type="password" placeholder="Password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login">Log in</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <span>Don't have an account?</span>
                    <router-link :to="{name: 'home'}" class="link">Create an account</router-link>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import { Login } from '../constants/query.gql'
    export default {
        name: 'Login',
        data() {
            return {
                error: '',
                form: {
                    email: '',
                    password: ''
                }
            }
        },
        methods: {
            async login() {
                // this.$apolloProvider.clients.defaultClient.cache.reset() //clear cache when user diffrent login
                const {email, password} = this.form
                if (email && password) {
                    console.log('this', this.$apollo)
                    this.$apollo.mutate({
                        mutation: Login,
                        variables: {
                            email,
                            password
                        }
                    }).then(async data => {
                        const login = data.data.login
                        const id = login.user.id
                        const token = login.token
                        this.saveUserData(id, token)
                        this.$router.push({name: 'workspace'})
                    }).catch(error => {
                        console.log('error', error)
                    })
                }
            },
            saveUserData(id, token) {
                localStorage.setItem('user-id', id)
                localStorage.setItem('user-token', token)
                this.$root.$data.userId = localStorage.getItem('user-id')
            }
        }
    }
</script>
<style scoped>
    .el-button {
        width: 100%;
    }
    .el-input {
        padding-top: 30px;
    }
</style>