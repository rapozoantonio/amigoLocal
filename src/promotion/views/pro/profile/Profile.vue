<template>
    <div>
        <v-bottom-navigation grow>
            <v-btn exact :to="{ name: 'pro-profile' }">
                <v-icon>mdi-history</v-icon>

                <span>Pessoal</span>
            </v-btn>
            <v-btn exact :to="{ name: 'pro-profile-promoter' }">
                <v-icon>mdi-map-marker</v-icon>

                <span>Promoter</span>
            </v-btn>

        </v-bottom-navigation>
        <router-view></router-view>
    </div>
</template>

<script setup>


</script>

<style lang="scss" scoped>
.label {
    width: 75px;
}
</style>