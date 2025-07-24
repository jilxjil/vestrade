import ThemedText from '@/components/ThemedText'
import ThemedView from '@/components/ThemedView'
import React from 'react'

const Home = ({navigation}:any) => {
  return (
   <ThemedView className='flex-1 justify-center'>
    <ThemedText className='text-center'>THis is the Home VIew</ThemedText>
   </ThemedView>
  )
}

export default Home