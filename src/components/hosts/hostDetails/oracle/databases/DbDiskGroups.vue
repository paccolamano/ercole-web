<template>
  <b-tab-item label="Disk groups">
    <FullTable
      :tableData="diskGroups"
      :keys="keys"
      hideSearch
      hidePerpage
      hidePagination
      hideTopTable
      :isLoadingTable="false"
    >
      <template slot="headData">
        <v-th sortKey="diskGroupName">Disk group name</v-th>
        <v-th sortKey="totalSpace">Total space</v-th>
        <v-th sortKey="usedSpace">Used space</v-th>
        <v-th sortKey="freeSpace">Free space</v-th>
      </template>

      <template slot="bodyData" slot-scope="rowData">
        <TdContent :value="rowData.scope.diskGroupName" />
        <TdContent :value="rowData.scope.totalSpace" />
        <TdContent :value="rowData.scope.usedSpace" />
        <TdContent :value="rowData.scope.freeSpace" />
      </template>
    </FullTable>
  </b-tab-item>
</template>

<script>
import FullTable from '@/components/common/Table/FullTable.vue'
import TdContent from '@/components/common/Table/TdContent.vue'

export default {
  name: 'hosts-details-oracle-databases-diskgroups-component',
  props: {
    patches: {
      type: Array,
      default: null,
    },
  },
  components: {
    FullTable,
    TdContent,
  },
  data() {
    return {
      keys: ['diskGroupName', 'totalSpace', 'usedSpace', 'freeSpace'],
    }
  },
}
</script>

<style lang="scss" scoped></style>
