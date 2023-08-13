import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IVideo } from '@/interfaces/IVideo'

export const useVideo = (videoId: string) => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getVideo = async (id: string): Promise<IVideo> => {
    const { data } = await http.get(`/videos/${videoId}`)
    return data
  }

  const createVideo = async (
    newVideo: Partial<IVideo>,
  ): Promise<IVideo> => {
    const { data } = await http.post('/videos/create', newVideo)
    return data
  }

  const updateVideo = async (video: IVideo): Promise<IVideo> => {
    console.log(video)
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
    data: video,
    isLoading,
    error,
    refetch: refetchVideo,
    isRefetching,
  } = useQuery<IVideo, Error, IVideo, [string, string]>(
    ['video', videoId],
    ({ queryKey }) => {
      return getVideo(queryKey[1])
    },
  )

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
    video,
    isLoading: isLoading || isRefetching,
    error,
    refetchVideo,
    createVideo: mutationCreate.mutate,
    updateVideo: mutationUpdate.mutate,
    deleteVideo: mutationDelete.mutate,
  }
}
