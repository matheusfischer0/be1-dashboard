import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IVideo } from '@/interfaces/IVideo'

export const useVideos = () => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getVideos = async (): Promise<IVideo[]> => {
    const { data } = await http.post('/videos')
    return data
  }

  const createVideo = async (
    newVideo: Partial<IVideo>,
  ): Promise<IVideo> => {
    console.log(newVideo)
    const { data } = await http.post('/videos/create', newVideo)
    return data
  }

  const updateVideo = async (video: IVideo): Promise<IVideo> => {
    const { data } = await http.post(
      `/videos/update/${video.id}`,
      video,
    )
    return data
  }

  const deleteVideo = async (id: string): Promise<void> => {
    await http.delete(`/videos/${id}`)
  }

  const {
    data: videos,
    isLoading,
    error,
    refetch: refetchVideos,
    isRefetching,
  } = useQuery<IVideo[], Error>('videos', getVideos)

  const mutationCreate = useMutation<IVideo, Error, Partial<IVideo>>(
    createVideo,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('videos')
      },
    },
  )

  const mutationUpdate = useMutation<IVideo, Error, IVideo>(updateVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries('videos')
    },
  })

  const mutationDelete = useMutation<void, Error, string>(deleteVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries('videos')
    },
  })

  return {
    videos,
    isLoading: isLoading || isRefetching,
    error,
    refetchVideos,
    createVideo: mutationCreate.mutate,
    updateVideo: mutationUpdate.mutate,
    deleteVideo: mutationDelete.mutate,
  }
}
