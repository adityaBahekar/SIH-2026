import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WorkflowHeader } from '../components/WorkflowHeader';
import type { CatalogResponse, EnhancedImageResponse, PricingResponse } from '../services/api';

interface PreviewScreenProps {
  catalog: CatalogResponse;
  image: EnhancedImageResponse;
  pricing: PricingResponse;
  onSave: () => void;
  onBack: () => void;
  saving: boolean;
}

export function PreviewScreen({ catalog, image, pricing, onSave, onBack, saving }: PreviewScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <WorkflowHeader activeStep="publish" />
      <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={saving}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.kicker}>FINAL REVIEW</Text>
      <Text style={styles.title}>Your product is ready.</Text>
      <Text style={styles.subtitle}>Make any last changes before saving this listing.</Text>
      <Image source={{ uri: image.enhancedUrl }} style={styles.image} />
      {catalog.demoMode ? (
        <View style={styles.demoBadge}>
          <Text style={styles.demo}>DEMO MODE: review generated suggestions carefully.</Text>
        </View>
      ) : null}
      <Text style={styles.productTitle}>{catalog.title}</Text>
      <Text style={styles.meta}>{catalog.category} · {catalog.material ?? 'Handcrafted'}</Text>
      <Text style={styles.sectionLabel}>English description</Text>
      <Text style={styles.body}>{catalog.descriptionEn}</Text>
      <Text style={styles.sectionLabel}>Hindi description</Text>
      <Text style={styles.body}>{catalog.descriptionHi}</Text>
      <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>RECOMMENDED PRICE</Text>
        <Text style={styles.price}>₹{pricing.recommendedPrice}</Text>
        <Text style={styles.range}>Suggested range ₹{pricing.minPrice} - ₹{pricing.maxPrice}</Text>
      </View>
      <TouchableOpacity
        style={[styles.primaryButton, saving ? styles.primaryButtonDisabled : null]}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <View style={styles.savingRow}>
            <ActivityIndicator color="#FFF9F2" size="small" />
            <Text style={styles.primaryText}>Saving to catalog...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.primaryText}>Save product</Text>
            <Text style={styles.arrow}>✓</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F3EC' },
  content: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 50 },
  backButton: { paddingVertical: 8, alignSelf: 'flex-start' },
  backText: { color: '#53665A', fontSize: 15, fontWeight: '700' },
  kicker: { color: '#D96C45', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 18 },
  title: { color: '#263B35', fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#6F736D', fontSize: 15, lineHeight: 22, marginTop: 8 },
  image: { width: '100%', aspectRatio: 1.2, borderRadius: 16, backgroundColor: '#E4DED4', marginTop: 20 },
  demoBadge: { backgroundColor: '#F9ECE5', borderRadius: 8, padding: 8, marginTop: 12 },
  demo: { color: '#9A634F', fontSize: 12, fontWeight: '700' },
  productTitle: { color: '#263B35', fontSize: 24, fontWeight: '800', marginTop: 16 },
  meta: { color: '#53725C', fontSize: 15, fontWeight: '700', marginTop: 4 },
  sectionLabel: { color: '#7B766E', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 20, marginBottom: 5 },
  body: { color: '#53665A', fontSize: 14, lineHeight: 22 },
  priceBox: { backgroundColor: '#E8F0E3', borderRadius: 16, padding: 18, marginTop: 22 },
  priceLabel: { color: '#53725C', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  price: { color: '#263B35', fontSize: 34, fontWeight: '800', marginTop: 4 },
  range: { color: '#53725C', fontSize: 14, fontWeight: '600', marginTop: 2 },
  primaryButton: { backgroundColor: '#D96C45', minHeight: 56, borderRadius: 16, marginTop: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryText: { color: '#FFF9F2', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFF9F2', fontSize: 22 },
  savingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' },
});
