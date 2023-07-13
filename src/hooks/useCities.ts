import { useQuery } from 'react-query'
import { http } from '@/lib/http-common'

interface ICityProps {
  id: number
  nome: string
  uf: string
}

interface IStateProps {
  id: number
  sigla: string
  nome: string
}

interface ISelectOptionsProps {
  value: string
  label: string
  uf: string
}

const fetchCities = async (siglaUF: string) => {
  console.log('Carregando Cidades', siglaUF)

  const response = await http.get<Array<ICityProps>>(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUF}/municipios`,
  )

  const data = response.data.map((item) => ({
    value: item.nome,
    label: item.nome,
  }))

  return data as ISelectOptionsProps[]
}

const fetchStates = async () => {
  const response = await http.get<Array<IStateProps>>(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
  )

  const data = response.data
    .map((item) => {
      return {
        value: item.nome,
        label: item.nome,
        uf: item.sigla,
      }
    })
    .sort((a, b) => (a.uf > b.uf ? 1 : -1))

  return data as ISelectOptionsProps[]
}

export const useCities = (siglaUF?: string) => {
  const {
    data: cities,
    isLoading: isCitiesLoading,
    refetch: refetchCities,
  } = useQuery<ISelectOptionsProps[], Error>(
    ['cities', siglaUF],
    () => fetchCities(siglaUF || 'SC'),
    { enabled: false },
  )

  const { data: states, isLoading: isStatesLoading } = useQuery<
    ISelectOptionsProps[],
    Error
  >('states', () => fetchStates())

  return {
    cities,
    states,
    isCitiesLoading,
    isStatesLoading,
    filterCities: refetchCities,
  }
}
