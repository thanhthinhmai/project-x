<template name="tree">
    <li>
        <div class="tree-item"
             @click.right.stop.prevent="$store.commit('changeActiveWidget', `folder${model.id}`)"
             @click.left.stop="$router.push({name: 'folder', params: {id: model.id}})">
      <span @click="toggle" class="fold-button"
            v-bind:class="{active: $route.params.id === model.id}"
            v-bind:style="{visibility: isFolder ? 'visible' : 'hidden'}">
        <i :class="`fas fa-angle-${open ? 'down' : 'right'}`"></i>
      </span>
            <div class="tree-plate" v-bind:class="{active: $route.params.id === model.id}">
                <span class="folder no-select-color">{{ model.name }}</span>
                <div class="dropdown-content left" v-show="activeWidget === `folder${model.id}`">
                    <div @click="openModal">Add Folder</div>
                     <!--<div @click="deleteFolder">Delete</div>-->
                </div>
            </div>
        </div>
        <ul class="tree" v-show="open" v-if="isFolder">
            <tree
                    v-for="folder in getFolders"
                    :key="folder.id"
                    :model="folder"
                    @open="openArrow"
            >
            </tree>
        </ul>
        <FolderForm v-if="showModal" :config="modalConfig.parent" @close="showModal = false"></FolderForm>
    </li>
</template>

<script>
    import { mapState } from 'vuex'
    import FolderForm from './FolderForm'
    import FolderTree from './FolderForm'
    import { GetFolders } from '../constants/query.gql'

    export default {
        name: 'FolderTree',
        components: {
            FolderForm,
            'tree': FolderTree
        },
        props: ['model', 'team'],
        data() {
            return {
                open: false,
                showModal: false,
                modalConfig: {},
                getFolders: []
            }
        },
        mounted() {
            if (this.$route.params.id === this.model.id) {
                this.$emit('open')
            }
        },
        computed: {
            isFolder() {
                return this.getFolders.length > 0
            },
            ...mapState(['activeWidget'])
        },
        apollo: {
            getFolders: {
                query: GetFolders,
                variables() {
                    return {
                        parent: this.model.id
                    }
                },
                error(error) {
                    console.log('error Folder', error)
                }
            }
        },
        methods: {
            toggle() {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },
            openModal() {
                this.$store.commit('changeActiveWidget', null)
                this.showModal = true
                this.modalConfig = {
                    parent: this.model.id
                }
            },
            openArrow() {
                this.open = true
                this.$emit('open')
            }
        },
        watch: {
            '$route' (to, from) {
                if (to.params.id === this.model.id) {
                    this.$emit('open')
                }
            }
        }
    }
</script>
