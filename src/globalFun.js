const mixin = {
    methods: {
        hasAuth(perm) {
            var authorities = this.$store.state.menus.permList;

            return authorities.indexOf(perm) > -1;
        }
    }

}
export default mixin