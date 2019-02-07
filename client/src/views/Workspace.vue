<template>
    <div>
        <div class="container">
            <aside class="tree-root">
                <div v-if="getTeam.id" class="tree-item"
                     @click.right.stop.prevent="$store.commit('changeActiveWidget', `folder${getTeam.id}`)"
                     @click.left.stop="$router.push({name: 'folder', params: {id: getTeam.id}})">
                    <div class="tree-plate"  v-bind:class="{active: $route.params.id === getTeam.id}">
                        <div class="circle"></div>
                        <span class="folder no-select-color teamname">{{ getTeam.name }}</span>
                        <plus-button @click="openModal" color="white"></plus-button>
                        <div class="dropdown-content left" v-show="activeWidget === `folder${getTeam.id}`">
                            <div @click="openModal">Add Folder</div>
                        </div>
                    </div>
                </div>
                <Tree
                        v-for="folder in getFolders"
                        :key="folder.id"
                        :model="folder"
                        :team="getTeam.id" >
                </Tree>
            </aside>
            <div class="workspace-main">
                <router-view :key="$route.fullPath"></router-view>
            </div>
            <FolderForm v-if="showModal" :config="{parent: ''}" @close="showModal = false"></FolderForm>
        </div>
    </div>
</template>
<script>
    import { GetTeam, GetFolders } from '../constants/query.gql'
    // import gql from 'graphql-tag'
    import { mapState } from  'vuex'
    import Tree from '@/components/FolderTree'
    import FolderForm from '@/components/FolderForm'

    export default  {
        name: 'Workspace',
        data() {
            return {
                getTeam: {},
                showModal: false,
                getFolders: []
            }
        },
        components: {
            Tree,
            FolderForm
        },
        computed: {
            ...mapState(['activeWidget'])
        },
        apollo: {
            getTeam: {
                query: GetTeam
            },
            getFolders: {
                query: GetFolders,
                error(error) {
                    console.log('error Workspace', error)
                }
            }
        },
        methods: {
            openModal() {
                this.$store.commit('changeActiveWidget', null)
                this.showModal = true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: calc(100% - 52px);
        .tree-item {
            .teamname {
                color: #2c3e50;
            }
        }
    }
    .plus-button {
        position: absolute;
        right: 0;
        top: 7px;
        margin: 0 2px;
    }
    aside {
        width: 220px;
        height: 100%;
        display: inline-block;
    }
    .workspace-main {
        flex: 1 1;
    }
</style>
