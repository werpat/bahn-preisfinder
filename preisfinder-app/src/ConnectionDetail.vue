<script setup>
import { secondsToHourString, extractTime } from './assets/helper'
const { connection } = defineProps(['connection'])
</script>

<template>
    <div class="p-2 connection">
        <table>
            <template v-for="(section, index) in connection.verbindungsAbschnitte" :key="index" class="px-4 py-1">
                <tr class="x-small">
                    <td class="text-start">{{ extractTime(section.abfahrtsZeitpunkt) }}</td>
                    <td class="text-center">
                        <div class="vr" v-if="index !== 0"></div>
                    </td>
                    <td class="text-end">{{ extractTime(section.ankunftsZeitpunkt) }}</td>
                </tr>
                <tr>
                    <td class="text-start">
                        <div class="inline-hr">
                            {{ section.abfahrtsOrt }}
                            <hr />
                        </div>
                    </td>
                    <td class="text-center x-small">{{ section.verkehrsmittel.kategorie }} - {{ secondsToHourString(section.abschnittsDauer) }}</td>
                    <td class="text-end">
                        <div class="inline-hr">
                            <hr />{{ section.ankunftsOrt }}
                        </div>
                    </td>
                </tr>
                <template v-if="index < connection.verbindungsAbschnitte.length - 1">
                    <tr class="x-small">
                        <td></td>
                        <td class="text-center">
                            <div class="vr"></div>
                        </td>
                    </tr>
                    <tr class="x-small">
                        <td></td>
                        <td class="text-center">{{ secondsToHourString(((new Date(connection.verbindungsAbschnitte[index
                            +
                            1].abfahrtsZeitpunkt)).valueOf() - (new Date(section.ankunftsZeitpunkt)).valueOf()) /
                            1000) }}
                        </td>
                    </tr>
                </template>
            </template>
        </table>
    </div>
    <button @click="console.log(connection)">butt</button>
</template>

<style scoped>
.x-small {
    font-size: x-small;
}

.inline-hr {
    display: flex;
}

.inline-hr hr {
    flex-grow: 1;
    margin: auto 5px;
}

table {
    width: 100%;
}

.connection {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>