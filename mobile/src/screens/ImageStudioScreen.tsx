import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WorkflowHeader } from '../components/WorkflowHeader';

interface ImageStudioScreenProps {
  imageUri: string;
  enhancedUri: string | null;
  demoMode: boolean;
  onUseImage: () => void;
  onBack: () => void;
  loading?: boolean;
}

export function ImageStudioScreen({ imageUri, enhancedUri, demoMode, onUseImage, onBack, loading = false }: ImageStudioScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <WorkflowHeader activeStep="photo" />
      <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={loading}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.kicker}>PHOTO STUDIO</Text>
      <Text style={styles.title}>Your product, ready for the shelf.</Text>
      <Text style={styles.subtitle}>We cleaned up the framing and prepared your image for a product listing.</Text>
      <View style={styles.imageRow}>
        <View style={styles.imageColumn}>
          <Text style={styles.imageLabel}>BEFORE</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
        <View style={styles.imageColumn}>
          <Text style={styles.imageLabel}>AFTER</Text>
          <Image source={{ uri: enhancedUri ?? imageUri }} style={styles.image} />
        </View>
      </View>
      {demoMode ? (
        <Text style={styles.demoNote}>Demo photo mode is active. Connect Cloudinary for AI cloud image enhancement.</Text>
      ) : null}
      <TouchableOpacity
        style={[styles.primaryButton, loading ? styles.primaryButtonDisabled : null]}
        onPress={onUseImage}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#FFF9F2" size="small" />
            <Text style={styles.primaryText}>Generating catalog...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.primaryText}>Use this photo</Text>
            <Text style={styles.arrow}>→</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F3EC' },
  content: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8 },
  backText: { color: '#53665A', fontSize: 15, fontWeight: '700' },
  kicker: { color: '#D96C45', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 18 },
  title: { color: '#263B35', fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 9 },
  subtitle: { color: '#6F736D', fontSize: 15, lineHeight: 22, marginTop: 10 },
  imageRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  imageColumn: { flex: 1 },
  imageLabel: { color: '#7B766E', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 7 },
  image: { width: '100%', aspectRatio: 1, borderRadius: 14, backgroundColor: '#E4DED4' },
  demoNote: { color: '#8D6758', fontSize: 12, lineHeight: 17, marginTop: 14 },
  primaryButton: { backgroundColor: '#D96C45', minHeight: 58, borderRadius: 16, marginTop: 28, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryText: { color: '#FFF9F2', fontSize: 17, fontWeight: '800' },
  arrow: { color: '#FFF9F2', fontSize: 26 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' },
});
