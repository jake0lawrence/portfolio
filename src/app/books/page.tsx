import { Column, Grid, Heading } from '@once-ui-system/core';
import TheLiminalCard from './TheLiminalCard';
import WhispersBeneathTheTridentSkyCard from './WhispersBeneathTheTridentSkyCard';

export default function Books() {
  return (
    <Column maxWidth="m" gap="l">
      <Heading variant="display-strong-s">Books</Heading>
      <Grid columns="3" mobileColumns="1">
        <TheLiminalCard
          cover="https://i.imgur.com/ixuC2W8.png"
          synopsis="In the darkness between dimensions, something ancient is waking. The Liminal is a sci-fi horror descent into fractured time, shifting realities, and a voice that isn’t yours."
          readLink="https://books.jakelawrence.io/2/the-liminal"
        />
        <WhispersBeneathTheTridentSkyCard
          cover="https://i.imgur.com/673MvMZ.png"
          synopsis="Cold-war capsules drift home on spectral orbits, whispering Ukrainian lullabies through the aurora. Archivist Katya Melnyk must decode their haunted signals before memory—and Earth’s skies—ignite."
          readLink="https://books.jakelawrence.io/3/whispers-beneath-the-trident-sky"
        />
      </Grid>
    </Column>
  );
}
