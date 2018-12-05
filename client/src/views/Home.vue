<template>
  <el-container>
    <el-header>
    </el-header>

    <el-main>
      <div class="container-center">
        <h2>Welcome!</h2>
        <div>Enter your email address to start free trial</div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <el-form ref="form" :model="form" @submit.native.prevent="capture">
          <el-form-item>
            <el-input v-model="form.email" placeholder="Email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="capture">Create my enamel account</el-button>
          </el-form-item>
        </el-form>

        <div>
          <span>Already have an enamel account?</span>
          <router-link :to="{name: 'login'}" class="link">Log in</router-link>
        </div>

        <div v-if="submitted">
          <div>Thank you!</div>
          <div>Please check your email.</div>
        </div>
      </div>

    </el-main>
  </el-container>

</template>

<script>
    import { CaptureEmail } from '../constants/query.gql'
    import { validateEmail } from '@/helpers/helpers'
    export default {
        name: 'Home',
        data() {
            return {
                submitted: false,
                error: false,
                form: {
                    email: '',
                }
            }
        },
        methods: {
            capture() {
                const {email} = this.form
                if (!email || !validateEmail(email)) {
                    this.error = 'Please enter a valid email'
                    return
                }
                console.log('step1')
                this.$apollo.mutate({
                    mutation: CaptureEmail,
                    variables: {email}
                }).then(({data}) => {
                    console.log('step2')
                    this.submitted = true
                    this.error = false
                    // For development only
                    console.log(data.captureEmail.id)
                }).catch((error) => {
                    console.log('step4')
                    if (error.graphQLErrors.length >= 1) {
                        this.error = error.graphQLErrors[0].message
                    } else {
                        this.error = 'Something went wrong'
                    }
                    console.log('ERROR', error)
                })
                console.log('step3')
            },
        }
    }
</script>

<style scoped lang="scss">
  .el-form {
    padding-top: 20px;
  }
  .el-button {
    width: 100%;
  }
  .error {
    padding-top: 10px;
  }
</style>