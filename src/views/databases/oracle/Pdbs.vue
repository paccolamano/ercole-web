<template>
  <BoxContent
    title="Pluggable Databases"
    border
    hasShadow
    :mbottom="false"
    customStyle="padding-left: 1rem"
  >
    <b-select v-model="selectedHost" size="is-small">
      <option v-for="host in oraclePdbs.pdbsHosts" :value="host" :key="host">
        {{ host }}
      </option>
    </b-select>

    <FullTable
      :tableData="getOraclePdbs(selectedHost)"
      :keys="[
        'dbname',
        'hostname',
        'name',
        'status',
        'allocable',
        'datafileSize',
        'segmentsSize',
        'tablespaces',
        'schemas',
        'grantDba',
        'segmentAdvisors',
        'dbgrowth',
        'psqlMigrable',
      ]"
      :isLoadingTable="false"
      style="cursor: default"
    >
      <template slot="headData">
        <v-th sortKey="name">PDB Name</v-th>
        <v-th sortKey="dbname">DB Name</v-th>
        <v-th sortKey="hostname">Hostname</v-th>
        <v-th sortKey="schemas">Schemas</v-th>
        <v-th sortKey="tablespaces">Tablespaces</v-th>
        <v-th sortKey="grantDba">Grant Role</v-th>
        <v-th sortKey="segmentAdvisors">Segment Advisors</v-th>
        <v-th sortKey="partitionings">Partitioning</v-th>
        <v-th sortKey="dbgrowth">DB Growth</v-th>
        <v-th sortKey="dbgrowth">Services</v-th>
        <v-th sortKey="psqlMigrable">Migrable to Postgre</v-th>
        <!-- <v-th sortKey="psqlMigrable">Policy Audit</v-th> -->
        <v-th sortKey="status">Status</v-th>
        <v-th sortKey="allocable">Allocable</v-th>
        <v-th sortKey="datafileSize">DatafileSize</v-th>
        <v-th sortKey="segmentsSize">SegmentsSize</v-th>
      </template>

      <template slot="bodyData" slot-scope="rowData">
        <TdContent
          @click.native="pdbHostDetailLink(rowData.scope.hostname)"
          :value="rowData.scope.name"
          class="first-col"
        />
        <TdContent
          @click.native="pdbHostDetailLink(rowData.scope.hostname)"
          :value="rowData.scope.dbname"
        />
        <HostLink :hostname="rowData.scope.hostname" />
        <td class="is-clickable">
          <b-icon
            v-tooltip="options('Click to see Schemas information')"
            icon="arrow-up-right-from-square"
            pack="fa"
            type="is-black"
            style="width: 100%"
            @click.native="openModal(0, rowData.scope)"
          />
        </td>
        <td class="is-clickable">
          <b-icon
            v-tooltip="options('Click to see Tablespaces information')"
            icon="arrow-up-right-from-square"
            pack="fa"
            type="is-black"
            style="width: 100%"
            @click.native="openModal(1, rowData.scope)"
          />
        </td>
        <td class="is-clickable">
          <b-icon
            v-tooltip="options('Click to see Grant Role information')"
            icon="arrow-up-right-from-square"
            pack="fa"
            type="is-black"
            style="width: 100%"
            @click.native="openModal(2, rowData.scope)"
          />
        </td>
        <td class="is-clickable">
          <b-icon
            v-tooltip="options('Click to see Segment Advisors information')"
            icon="arrow-up-right-from-square"
            pack="fa"
            type="is-black"
            style="width: 100%"
            @click.native="openModal(3, rowData.scope)"
          />
        </td>
        <td class="is-clickable">
          <b-icon
            v-tooltip="options('Click to see Partitioning information')"
            icon="arrow-up-right-from-square"
            pack="fa"
            type="is-black"
            style="width: 100%"
            @click.native="openModal(4, rowData.scope)"
          />
        </td>
        <td class="is-clickable">
          <b-icon
            v-tooltip="options('Click to see DB Growth chart')"
            icon="arrow-up-right-from-square"
            pack="fa"
            type="is-black"
            style="width: 100%"
            @click.native="openModal(5, rowData.scope)"
          />
        </td>
        <td class="is-clickable">
          <b-icon
            v-tooltip="options('Click to see Services information')"
            icon="arrow-up-right-from-square"
            pack="fa"
            type="is-black"
            style="width: 100%"
            @click.native="openModal(6, rowData.scope)"
          />
        </td>
        <td class="is-clickable">
          <b-button
            icon-pack="fas"
            :icon-left="getIcon(rowData.scope.semaphoreColor)"
            :type="getColor(rowData.scope.semaphoreColor)"
            size="is-small"
            class="is-clickable"
            @click="openModal(7, rowData.scope)"
            v-tooltip="options('Click to see Migrable to Postgre information')"
            v-if="getColor(rowData.scope.semaphoreColor) !== ''"
          >
            Details
          </b-button>
          <span v-else>-</span>
        </td>
        <TdContent :value="rowData.scope.status" />
        <TdContent :value="rowData.scope.allocable" />
        <TdContent :value="rowData.scope.datafileSize" />
        <TdContent :value="rowData.scope.segmentsSize" />
      </template>

      <ExportButton
        slot="export"
        url="hosts/technologies/oracle/databases/pdbs"
        expName="oraclePdbs"
      />
    </FullTable>

    <b-modal :active.sync="isModalActive" :width="1500" scroll="keep">
      <PdbsModal
        :pdbName="modalData.pdbName"
        :dbName="modalData.dbName"
        :hostname="modalData.hostname"
        :tab="modalData.tab"
        :data="modalData.data"
        :dbgrowth="modalData.dbgrowth"
        :tabsData="modalData.tabsData"
      />
    </b-modal>
  </BoxContent>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import TooltipMixin from '@/mixins/tooltipMixin.js'
import HighlightSearchMixin from '@/mixins/highlightSearch.js'
import BoxContent from '@/components/common/BoxContent.vue'
import PdbsModal from '@/views/databases/oracle/PdbsModal.vue'
import FullTable from '@/components/common/Table/FullTable.vue'
import TdContent from '@/components/common/Table/TdContent.vue'
import HostLink from '@/components/common/Table/HostLink.vue'
import ExportButton from '@/components/common/ExportButton.vue'

export default {
  name: 'oracle-databases-pdbs-page',
  mixins: [TooltipMixin, HighlightSearchMixin],
  components: {
    BoxContent,
    FullTable,
    TdContent,
    PdbsModal,
    HostLink,
    ExportButton,
  },
  data() {
    return {
      isMounted: false,
      selectedHost: '',
      isModalActive: false,
      modalData: {},
    }
  },
  async beforeMount() {
    await this.getPdbs().then(() => {
      this.isMounted = true
    })
    this.selectedHost = this.oraclePdbs.pdbsHosts[0]
  },
  methods: {
    ...mapActions(['getPdbs']),
    openModal(tab, data) {
      this.isModalActive = true
      this.modalData = {
        pdbName: data.name,
        dbName: data.dbname,
        hostname: data.hostname,
        tab: tab,
        data: data,
        tabsData: this.getOraclePdbsModal(data.name)[0],
      }
    },
    pdbHostDetailLink(value) {
      this.$router.push({
        name: 'hosts-details',
        params: { hostname: value },
      })
    },
    getColor(semaphoreColor) {
      let color
      if (semaphoreColor === 'red') {
        color = 'is-danger'
      } else if (semaphoreColor === 'yellow') {
        color = 'is-warning'
      } else if (semaphoreColor === 'green') {
        color = 'is-primary'
      } else {
        color = ''
      }
      return color
    },
    getIcon(semaphoreColor) {
      let icon
      if (semaphoreColor === 'red') {
        icon = 'minus'
      }
      if (semaphoreColor === 'yellow') {
        icon = 'exclamation'
      }
      if (semaphoreColor === 'green') {
        icon = 'check'
      }
      return icon
    },
  },
  computed: {
    ...mapState(['oraclePdbs']),
    ...mapGetters([
      'getOraclePdbs',
      'getOraclePdbsModal',
      'loadingTableStatus',
    ]),
  },
}
</script>

<style lang="scss" scoped></style>
