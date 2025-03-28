import _ from 'lodash'
import { axiosRequest } from '@/services/services.js'

export const state = () => ({
  awsRdsDbs: [],
})

export const getters = {
  returnAwsRdsDbs: (state) => {
    const data = _.map(state.awsRdsDbs, (val) => {
      const standard = val.edition === 'standard' ? val.licensesCount : 0
      const enterprise = val.edition === 'enterprise' ? val.licensesCount : 0

      return {
        ...val,
        standardCount: _.includes(val.engine, 'oracle') ? standard : null,
        enterpriseCount: _.includes(val.engine, 'oracle') ? enterprise : null,
      }
    })

    return data
  },
}

export const mutations = {
  SET_AWSRDS_DBS: (state, payload) => {
    state.awsRdsDbs = payload
  },
}

export const actions = {
  async getAwsRdsDbs({ commit }) {
    const config = {
      method: 'get',
      url: 'aws/rds',
    }

    await axiosRequest('thunderApi', config).then((res) => {
      commit('SET_AWSRDS_DBS', res.data.awsDbInstances)
    })
  },
}
