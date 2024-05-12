<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Day from './Day.vue'

const request = reactive({
  abfahrtsHalt: "A=1@O=Dresden Hbf@X=13732039@Y=51040562@U=80@L=8010085@B=1@p=1713983793@i=U×008006050@",
  anfrageZeitpunkt: (new Date()).addDays(1),
  ankunftsHalt: "A=1@O=Trient@X=11118901@Y=46072287@U=80@L=8300101@B=1@p=1713983793@i=U×008302038@",
  ankunftSuche: 'ABFAHRT',
  klasse: 'KLASSE_2',
  pagingReference: null,
  produktgattungen: [
    'ICE',
    'EC_IC',
    'IR',
    'REGIONAL',
    'SBAHN',
    'BUS',
    'SCHIFF',
    'UBAHN',
    'TRAM',
    'ANRUFPFLICHTIG'
  ],
  reisende: [
    {
      typ: 'ERWACHSENER',
      ermaessigungen: [
        {
          art: 'BAHNCARD25',
          klasse: 'KLASSE_2'
        }
      ],
      alter: [],
      anzahl: 1
    },
    {
      typ: 'FAHRRAD',
      ermaessigungen: [
        {
          art: 'KEINE_ERMAESSIGUNG',
          klasse: 'KLASSENLOS'
        }
      ],
      alter: [],
      anzahl: 1
    }
  ],
  schnelleVerbindungen: true,
  sitzplatzOnly: false,
  bikeCarriage: computed(() => request.reisende.some((el => el.typ === 'FAHRRAD'))),
  reservierungsKontingenteVorhanden: false
})

const travellerTypes = [
  { value: 'ERWACHSENER', text: 'Person (27-64 Jahre)' },
  { value: 'SENIOR', text: 'Person (ab 65 Jahre)' },
  { value: 'JUGENDLICHER', text: 'Person (15-26 Jahre)' },
  { value: 'FAMILIENKIND', text: 'Kind (6-14 Jahre)' },
  { value: 'KLEINKIND', text: 'Kind (0-5 Jahre)' },
  { value: 'FAHRRAD', text: 'Fahrrad' },
  { value: 'HUND', text: 'Hund' },
]
const discountTypes = [
  { value: 'KEINE_ERMAESSIGUNG&KLASSENLOS', text: 'Keine Ermäßigung', art: '', klasse: 'KLASSENLOS' },
  { value: 'BAHNCARD25&KLASSE_2', text: 'BahnCard 25, 2. Klasse', art: 'BAHNCARD25', klasse: 'KLASSE_2' },
  { value: 'BAHNCARD25&KLASSE_1', text: 'BahnCard 25, 1. Klasse', art: 'BAHNCARD25', klasse: 'KLASSE_1' },
  { value: 'BAHNCARD50&KLASSE_2', text: 'BahnCard 50, 2. Klasse', art: 'BAHNCARD50', klasse: 'KLASSE_2' },
  { value: 'BAHNCARD50&KLASSE_1', text: 'BahnCard 50, 1. Klasse', art: 'BAHNCARD50', klasse: 'KLASSE_1' },
  { value: 'BAHNCARD100&KLASSE_2', text: 'BahnCard 100, 2. Klasse', art: 'BAHNCARD100', klasse: 'KLASSE_2' },
  { value: 'BAHNCARD100&KLASSE_1', text: 'BahnCard 100, 1. Klasse', art: 'BAHNCARD100', klasse: 'KLASSE_1' },
  { value: 'BAHNCARDBUSINESS25&KLASSE_2', text: 'BahnCard Business 25, 2. Klasse', art: 'BAHNCARDBUSINESS25', klasse: 'KLASSE_2' },
  { value: 'BAHNCARDBUSINESS25&KLASSE_1', text: 'BahnCard Business 25, 1. Klasse', art: 'BAHNCARDBUSINESS25', klasse: 'KLASSE_1' },
  { value: 'BAHNCARDBUSINESS50&KLASSE_2', text: 'BahnCard Business 50, 2. Klasse', art: 'BAHNCARDBUSINESS50', klasse: 'KLASSE_2' },
  { value: 'BAHNCARDBUSINESS50&KLASSE_1', text: 'BahnCard Business 50, 1. Klasse', art: 'BAHNCARDBUSINESS50', klasse: 'KLASSE_1' },
  { value: 'BAHNCARDBUSINESS100&KLASSE_2', text: 'CH-General-Abonnement, 2. Klasse', art: 'BAHNCARDBUSINESS100', klasse: 'KLASSE_2' },
  { value: 'BAHNCARDBUSINESS100&KLASSE_1', text: 'CH-General-Abonnement, 1. Klasse', art: 'BAHNCARDBUSINESS100', klasse: 'KLASSE_1' },
  { value: 'CH-GENERAL-ABONNEMENT&KLASSE_2', text: 'BahnCard Business 50, 2. Klasse', art: 'CH-GENERAL-ABONNEMENT', klasse: 'KLASSE_2' },
  { value: 'CH-GENERAL-ABONNEMENT&KLASSE_1', text: 'BahnCard Business 50, 1. Klasse', art: 'CH-GENERAL-ABONNEMENT', klasse: 'KLASSE_1' },
  { value: 'CH-HALBTAXABO_OHNE_RAILPLUS&KLASSENLOS', text: 'HalbtaxAbo', art: 'CH-HALBTAXABO_OHNE_RAILPLUS', klasse: 'KLASSENLOS' },
  { value: 'A-VORTEILSCARD&KLASSENLOS', text: 'Vorteilscard Österreich', art: 'A-VORTEILSCARD', klasse: 'KLASSENLOS' },
  { value: 'NL-40_OHNE_RAILPLUS&KLASSENLOS', text: 'NL-40%', art: 'NL-40_OHNE_RAILPLUS', klasse: 'KLASSENLOS' },
  { value: 'KLIMATICKET_OE&KLASSENLOS', text: 'KlimaTicket Österreich', art: 'KLIMATICKET_OE', klasse: 'KLASSENLOS' }
]

//watch changes on from and to
//reset cache on change
watch(() => request.abfahrtsHalt, () => cache.clear())
watch(() => request.ankunftsHalt, () => cache.clear())

const renderedDays = [-1, 0, 1]
const loading = reactive(new Map())
const isLoadingAny = computed(() => renderedDays.map(offset => request.anfrageZeitpunkt.addDays(offset)).map(d => d.valueOf()).some(d => loading.get(d)))

function prevDay() {
  request.anfrageZeitpunkt = request.anfrageZeitpunkt.addDays(-1)
  let dayToLoad = request.anfrageZeitpunkt.addDays(-1)
  if (cache.has(dayToLoad.valueOf()))
    return Promise.resolve(cache.get(dayToLoad.valueOf()))
  return cacheConnectionsOfDay(dayToLoad)
}

function nextDay() {
  request.anfrageZeitpunkt = request.anfrageZeitpunkt.addDays(1)
  let dayToLoad = request.anfrageZeitpunkt.addDays(1)
  if (cache.has(dayToLoad.valueOf()))
    return Promise.resolve(cache.get(dayToLoad.valueOf()))
  return cacheConnectionsOfDay(dayToLoad)
}

const cache = reactive(new Map())
function fetchAllConnections() {
  const [day1, day2, day3] = renderedDays.map(offset => request.anfrageZeitpunkt.addDays(offset))
  return Promise.all([
    cacheConnectionsOfDay(day1),
    cacheConnectionsOfDay(day2),
    cacheConnectionsOfDay(day3)
  ])
}

async function cacheConnectionsOfDay(day) {
  //set loading flag for this day
  loading.set(day.valueOf(), true)
  //create own copy of request
  const baseRequest = JSON.parse(JSON.stringify(request))
  //set request day
  baseRequest.anfrageZeitpunkt = day.getDBString()


  //use reactive array and set array to cache, to get live updates of ui
  let allCons = reactive([])
  cache.set(day.valueOf(), allCons)

  //start loading first page then fetch next pages until next day
  let response = await fetchConnections(baseRequest)
  let cons = response.verbindungen.filter(con => day.isSameDayDBString(con.verbindungsAbschnitte[0].abfahrtsZeitpunkt))
  allCons.push(...cons)
  while (cons.length === response.verbindungen.length) {
    baseRequest.pagingReference = response.verbindungReference.later
    response = await fetchConnections(baseRequest)
    cons = response.verbindungen.filter(con => day.isSameDayDBString(con.verbindungsAbschnitte[0].abfahrtsZeitpunkt))
    console.log(`fetched additional new ${cons.length} out of ${response.verbindungen.length}`)
    allCons.push(...cons)
  }
  //remove loading flag for this day
  loading.set(day.valueOf(), false)
  return allCons
}

function fetchConnections(data) {
  console.log(request.anfrageZeitpunkt)
  return fetch('/bahn-api/angebote/fahrplan', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    referrer: 'https://www.bahn.de/buchung/fahrplan/suche',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(r => r.json())
}

const reqdate = computed({
  get() {
    return request.anfrageZeitpunkt.getDBString().substring(0, 10)
  },
  set(newValue) {
    const [year, month, day] = newValue.split('-').map(Number)
    request.anfrageZeitpunkt = new Date(year, month - 1, day, 0, 0, 0)
  }
})

const stationFromItems = ref([])
const fetchFromStations = (event) => fetchStations(event)
  .then(json => {
    //set items for dropdown select
    stationFromItems.value = json
    //set first result as used for request
    request.abfahrtsHalt = json[0].id || ''
  })

const stationToItems = ref([])
const fetchToStations = (event) => fetchStations(event)
  .then(json => {
    //set items for dropdown select
    stationToItems.value = json
    //set first result as used for request
    request.ankunftsHalt = json[0].id || ''
  })

function fetchStations(event) {
  return fetch(`/bahn-api/reiseloesung/orte?suchbegriff=${event.input}&typ=ALL&limit=10`)
    .then(response => response.json())
}

function setDiscount(traveller, discount) {
  const [art, klasse] = discount.split('&')
  traveller.ermaessigungen[0].art = art
  traveller.ermaessigungen[0].klasse = klasse
}

const production = computed(() => import.meta.env.PROD)
function debug() {
  window.debugCache = cache
  window.debugRequest = request
  console.log(cache, request)
}
</script>

<template>
  <div class="container shadow min-vh-100 py-2">
    <div class="row">
      <div class="col-4 p-2">
        <vue3-simple-typeahead class="form-control" id="station_from" placeholder="Von" :items="stationFromItems"
          :minInputLength="1" :itemProjection="(i) => i.name" @onInput="fetchFromStations"
          @selectItem="(item) => request.abfahrtsHalt = item.id">
        </vue3-simple-typeahead>
      </div>

      <div class="col-4 p-2">
        <vue3-simple-typeahead class="form-control" id="station_to" placeholder="Nach" :items="stationToItems"
          :minInputLength="1" :itemProjection="(i) => i.name" @onInput="fetchToStations"
          @selectItem="(item) => request.ankunftsHalt = item.id">
        </vue3-simple-typeahead>
      </div>

      <div class="col-4 p-2">
        <input type="date" class="form-control" id="reqdate" v-model.lazy="reqdate" />
      </div>
      <div class="col-6"></div>

      <div class="col-12 d-grid px-2">
        <div class="row py-2" v-for="(traveller, index) in request.reisende" :key="index">
          <div class="col-1">
            <select class="form-select" v-model="traveller.anzahl">
              <option v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>
          <div class="col-3">
            <select class="form-select" v-model="traveller.typ">
              <option v-for="t in travellerTypes" :key="t.value" :value="t.value">
                {{ t.text }}</option>
            </select>
          </div>
          <div class="col-3">
            <select class="form-select" @change="(event) => setDiscount(traveller, event.target.value)">
              <option v-for="(type, i) in discountTypes" :key="i" :value="type.value"
                :selected="type.value === [traveller.ermaessigungen[0].art, traveller.ermaessigungen[0].klasse].join('&')">
                {{ type.text }}</option>
            </select>
          </div>
          <div class="col px-2">
            <button v-if="request.reisende.length > 1" class="btn btn-primary mx-2"
              @click="() => request.reisende.splice(request.reisende.indexOf(traveller), 1)"><i
                class="bi bi-dash-square"></i></button>
            <button v-if="index === request.reisende.length - 1" class="btn btn-primary mx-2"
              @click="() => request.reisende.push(JSON.parse(JSON.stringify(traveller)))"><i
                class="bi bi-plus-square"></i></button>
          </div>
        </div>
      </div>
      <div class="col-12 p-2 d-grid">
        <button @click="fetchAllConnections" class="btn btn-primary">
          <span v-if="isLoadingAny" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Suchen
        </button>
      </div>

      <hr class="m-4" />

      <div class="col-6 p-2 d-grid">
        <button @click="prevDay()" class="btn btn-primary">vorhergehender Tag</button>
      </div>
      <div class="col-6 p-2 d-grid">
        <button @click="nextDay()" class="btn btn-primary">nächster Tag</button>
      </div>
    </div>

    <div class="row">
      <Day v-for="d in renderedDays" :key="d"
        :connections="cache.get(request.anfrageZeitpunkt.addDays(d).valueOf()) || []"
        :day="request.anfrageZeitpunkt.addDays(d)" :loading="loading.get(request.anfrageZeitpunkt.addDays(d).valueOf())"
        @refreshRequested="cacheConnectionsOfDay(request.anfrageZeitpunkt.addDays(d))" />
    </div>

    <div class="row mt-4" v-if="!production">
      <div class="col p-2 d-grid">
        <button @click="debug" class="btn btn-primary">Debug</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
</style>
