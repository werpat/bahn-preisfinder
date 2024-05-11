<script setup>
import ConnectionDetail from './ConnectionDetail.vue'
import { secondsToHourString, extractTime } from './assets/helper'
const { connections, day, loading } = defineProps(['connections', 'day', 'loading'])
const emit = defineEmits(['refreshRequested'])

function refreshClicked() {
    emit('refreshRequested')
}

function compareConnections(con1, con2) {
    return con1.verbindungsDauerInSeconds - con2.verbindungsDauerInSeconds
        || con1.umstiegsAnzahl - con2.umstiegsAnzahl
        || con1.abfahrtsZeitpunkt?.localeCompare(con2.abfahrtsZeitpunkt)
}
</script>

<template>
    <div class="col day">
        <div class="container h-100 d-flex flex-column">
            <div class="row">
                <div class="col d-flex justify-content-center">{{ day.getDateStringWithWeekDay() }}</div>
            </div>
            <div class="row">
                <table class="col">
                    <tr>
                        <th>Preis</th>
                        <th>Abfahrt</th>
                        <th>Umstiege</th>
                        <th>Fahrzeit</th>
                    </tr>
                    <template v-for="connection in connections.sort(compareConnections)" :key="connection.tripId">
                        <tr class="connection" @click="connection.detailsDisplayed ^= true">
                            <td>{{ connection.angebotsPreis?.betrag }} {{ connection.angebotsPreis?.waehrung }}</td>
                            <td>{{ extractTime(connection.verbindungsAbschnitte[0]?.abfahrtsZeitpunkt) }}</td>
                            <td>{{ connection.umstiegsAnzahl }}</td>
                            <td>{{ secondsToHourString(connection.verbindungsDauerInSeconds) }}</td>
                        </tr>
                        <tr v-if="connection.detailsDisplayed" @click="console.log(connection)">
                            <td colspan="4">
                                <ConnectionDetail :connection="connection"/>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
            <div class="row">
                <div class="col d-flex justify-content-center" v-if="loading">
                    <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div class="row pt-5 mt-auto">
                <div class="col p-2 d-grid">
                    <button @click="refreshClicked()" class="btn btn-primary">Refresh</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.day {
    border: solid var(--color-border) 1px;
    padding: 5px;
    margin: 5px;
}

.connection:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>