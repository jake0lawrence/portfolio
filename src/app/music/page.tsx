import { Column, Grid, Heading } from '@once-ui-system/core';
import DreamingInHexCard from './DreamingInHexCard';

export default function Music() {
  return (
    <Column maxWidth="m" gap="l">
      <Heading variant="display-strong-s">Music</Heading>
      <Grid columns="3" mobileColumns="1">
        <DreamingInHexCard
          embedUrl="https://bandcamp.com/EmbeddedPlayer/album=000/size=large"
          title="Dreaming in Hex"
          year="2024"
          bpm={120}
          tags={['synth', 'downtempo']}
        />
      </Grid>
    </Column>
  );
}
