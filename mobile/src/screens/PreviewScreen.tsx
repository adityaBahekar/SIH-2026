import { useState } from 'react';
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
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <WorkflowHeader activeStep="publish" />
      <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={saving}>
        <Text style={styles.backText}>← Back to pricing</Text>
      </TouchableOpacity>

      <View style={styles.kickerRow}>
        <Text style={styles.kicker}>FINAL PREVIEW & PUBLISH</Text>
        <View style={styles.readyBadge}>
          <Text style={styles.readyBadgeText}>Listing Ready</Text>
        </View>
      </View>

      <Text style={styles.title}>Your product is ready for the world.</Text>
      <Text style={styles.subtitle}>Review your complete verified catalog listing before saving.</Text>

      <View style={styles.imageCard}>
        <Image source={{ uri: image.enhancedUrl }} style={styles.image} />
        <View style={styles.imageFooter}>
          <Text style={styles.imageBadge}>✨ Studio Enhanced</Text>
          {catalog.demoMode ? <Text style={styles.demoNote}>Demo Mode</Text> : null}
        </View>
      </View>

      <View style={styles.mainInfo}>
        <Text style={styles.productTitle}>{catalog.title}</Text>
        <View style={styles.categoryPillRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{catalog.category}</Text>
          </View>
          {catalog.origin ? (
            <View style={styles.originPill}>
              <Text style={styles.originPillText}>📍 {catalog.origin}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* SPECS GRID */}
      <View style={styles.specsCard}>
        <Text style={styles.specsCardTitle}>Craft & Technical Specifications</Text>
        <View style={styles.specGrid}>
          <SpecItem label="Technique" value={catalog.technique ?? 'Traditional Handcraft'} />
          <SpecItem label="Material" value={catalog.material ?? 'Natural Craft Material'} />
          <SpecItem label="Color" value={catalog.color ?? 'Natural / Earth tone'} />
          <SpecItem label="Dimensions" value={catalog.dimensions ?? 'Standard Artisan Size'} />
          <SpecItem label="Weight" value={catalog.weight ?? 'As crafted'} />
          <SpecItem label="In Stock" value={`${catalog.stock ?? 5} units`} />
        </View>
        {catalog.careInstructions ? (
          <View style={styles.careBox}>
            <Text style={styles.careLabel}>🧼 Care Advice:</Text>
            <Text style={styles.careText}>{catalog.careInstructions}</Text>
          </View>
        ) : null}
      </View>

      {/* BILINGUAL STORY */}
      <View style={styles.storyCard}>
        <View style={styles.storyHeader}>
          <Text style={styles.storyTitle}>Product Story</Text>
          <View style={styles.langToggle}>
            <TouchableOpacity
              onPress={() => setActiveLang('en')}
              style={[styles.langBtn, activeLang === 'en' ? styles.langBtnActive : null]}
            >
              <Text style={[styles.langBtnText, activeLang === 'en' ? styles.langBtnTextActive : null]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveLang('hi')}
              style={[styles.langBtn, activeLang === 'hi' ? styles.langBtnActive : null]}
            >
              <Text style={[styles.langBtnText, activeLang === 'hi' ? styles.langBtnTextActive : null]}>हिंदी</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.storyBody}>
          {activeLang === 'en' ? catalog.descriptionEn : catalog.descriptionHi}
        </Text>

        {catalog.keywords.length > 0 ? (
          <View style={styles.keywordRow}>
            {catalog.keywords.map((kw, i) => (
              <View key={i} style={styles.kwTag}>
                <Text style={styles.kwText}>#{kw}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* PRICE CARD */}
      <View style={styles.priceCard}>
        <View style={styles.priceHeader}>
          <Text style={styles.priceLabel}>FAIR ARTISAN SELLING PRICE</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Transparent Math</Text>
          </View>
        </View>
        <Text style={styles.price}>₹{pricing.recommendedPrice}</Text>
        <Text style={styles.range}>Suggested range: ₹{pricing.minPrice} – ₹{pricing.maxPrice}</Text>
        <Text style={styles.costNote}>Direct Cost ₹{pricing.totalCost} · Margin {pricing.marginPercentage}%</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, saving ? styles.primaryButtonDisabled : null]}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <View style={styles.savingRow}>
            <ActivityIndicator color="#FFF9F2" size="small" />
            <Text style={styles.primaryText}>Saving to artisan catalog...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.primaryText}>Save Product to Catalog</Text>
            <Text style={styles.arrow}>✓</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.specItem}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7F2' },
  content: { paddingHorizontal: 22, paddingTop: 38, paddingBottom: 50 },
  backButton: { paddingVertical: 8, alignSelf: 'flex-start' },
  backText: { color: '#445D48', fontSize: 14, fontWeight: '700' },
  kickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  kicker: { color: '#C85A32', fontSize: 12, fontWeight: '800', letterSpacing: 1.1 },
  readyBadge: { backgroundColor: '#E3ECE3', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  readyBadgeText: { color: '#2F5938', fontSize: 11, fontWeight: '800' },
  title: { color: '#1E3A2F', fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#6F736D', fontSize: 14, lineHeight: 21, marginTop: 6 },
  imageCard: { borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#E5DED4', marginTop: 18 },
  image: { width: '100%', aspectRatio: 1.25, backgroundColor: '#E4DED4' },
  imageFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FAF7F2' },
  imageBadge: { color: '#2C4E33', fontSize: 12, fontWeight: '800' },
  demoNote: { color: '#9A634F', fontSize: 11, fontWeight: '700' },
  mainInfo: { marginTop: 16 },
  productTitle: { color: '#1E3A2F', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  categoryPillRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  categoryPill: { backgroundColor: '#EDE3D2', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  categoryPillText: { color: '#594A38', fontSize: 12, fontWeight: '800' },
  originPill: { backgroundColor: '#E3ECE3', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  originPillText: { color: '#2F5938', fontSize: 12, fontWeight: '700' },
  specsCard: { backgroundColor: '#FFFDF9', borderRadius: 16, borderWidth: 1, borderColor: '#E5DED4', padding: 16, marginTop: 16 },
  specsCardTitle: { color: '#1E3A2F', fontSize: 14, fontWeight: '800', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0EAE1', paddingBottom: 8 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specItem: { width: '48%', backgroundColor: '#FAF7F2', borderRadius: 10, padding: 10 },
  specLabel: { color: '#7E7A71', fontSize: 11, fontWeight: '700' },
  specValue: { color: '#1E3A2F', fontSize: 13, fontWeight: '800', marginTop: 3 },
  careBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0EAE1' },
  careLabel: { color: '#594A38', fontSize: 12, fontWeight: '800' },
  careText: { color: '#4A463F', fontSize: 12, lineHeight: 18, marginTop: 2 },
  storyCard: { backgroundColor: '#FFFDF9', borderRadius: 16, borderWidth: 1, borderColor: '#E5DED4', padding: 16, marginTop: 16 },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  storyTitle: { color: '#1E3A2F', fontSize: 14, fontWeight: '800' },
  langToggle: { flexDirection: 'row', backgroundColor: '#F0E9DF', borderRadius: 8, padding: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  langBtnActive: { backgroundColor: '#1E3A2F' },
  langBtnText: { color: '#594A38', fontSize: 12, fontWeight: '700' },
  langBtnTextActive: { color: '#FAF7F2' },
  storyBody: { color: '#3A3731', fontSize: 14, lineHeight: 22 },
  keywordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  kwTag: { backgroundColor: '#EDE5D8', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  kwText: { color: '#594A38', fontSize: 11, fontWeight: '700' },
  priceCard: { backgroundColor: '#EBF2E8', borderRadius: 18, borderWidth: 1, borderColor: '#C8D9C2', padding: 18, marginTop: 18 },
  priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: '#3A5C41', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  verifiedBadge: { backgroundColor: '#D4E6CF', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  verifiedText: { color: '#2C4E33', fontSize: 10, fontWeight: '800' },
  price: { color: '#1E3A2F', fontSize: 36, fontWeight: '900', marginTop: 4 },
  range: { color: '#2C4E33', fontSize: 14, fontWeight: '700', marginTop: 2 },
  costNote: { color: '#53665A', fontSize: 12, marginTop: 6 },
  primaryButton: { backgroundColor: '#C85A32', minHeight: 56, borderRadius: 16, marginTop: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryText: { color: '#FFF9F2', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFF9F2', fontSize: 22 },
  savingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' },
});
