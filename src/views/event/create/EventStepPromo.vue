<template>
    <div>
        <div class="flex flex-column">
            <div>
                <h3>PROMOÇÃO</h3>
                <!-- DESCRICAO -->
                <div class="flex flex-column gap-2">
                    <label for="description">Images</label>

                    <label for="files" class="btn">Select Image</label>
                    <input
                        id="files"
                        style="visibility: hidden"
                        type="file"
                        @change="handleUpload"
                    />

                    {{ files }}

                    <!-- <input
                        type="file"
                        @change="handleUpload"
                        placeholder="ull"
                    /> -->
                </div>
            </div>
        </div>
        <div class="flex justify-content-between py-4">
            <Button
                label="Back"
                severity="secondary"
                @click="props.prevCallback"
            />
        </div>
        <Button type="submit">Submit</Button>
    </div>
</template>

<script setup >
// import { useEventStore } from "@/store/event.js";
// import { storeToRefs } from "pinia";
import { defineProps, ref } from "vue";

// import FileUpload from "primevue/fileupload";

const props = defineProps(["nextCallback", "prevCallback"]);

// const store = useEventStore();
// const { event } = storeToRefs(store);

const files = ref(null);

function handleUpload(file) {
    console.log({ file });
    console.log(file.target.files);
    files.value = file.target.files;
}
</script>

<style lang="scss" scoped>
</style>