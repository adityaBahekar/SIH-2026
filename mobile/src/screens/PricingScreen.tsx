import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WorkflowHeader } from '../components/WorkflowHeader';
import { calculatePrice, type PricingResponse } from '../services/api';

interface PricingScreenProps {
  category: string;
  onBack: () => void;
  onContinue: (result: PricingResponse) => void;
}

const CATEGORY_PRESETS = [
  { label: '🏺 Pottery', key: 'pottery', mat: '180', lab: '240', pkg: '70', margin: '30' },
  { label: '🧣 Textiles', key: 'textiles', mat: '600', lab: '450', pkg: '60', margin: '30' },
  { label: '🪵 Woodwork', key: 'woodwork', mat: '550', lab: '500', pkg: '80', margin: '35' },
  { label: '💍 Jewellery', key: 'jewellery', mat: '850', lab: '650', pkg: '100', margin: '35' },
  { label: '👜 Bags & Leather', key: 'bags', mat: '380', lab: '320', pkg: '50', margin: '30' },
  { label: '🎨 Decor', key: 'decor', mat: '320', lab: '400', pkg: '60', margin: '30' },
];

const getCategoryDefaults = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes('jewel')) return { mat: '850', lab: '650', pkg: '100', margin: '35' };
  if (c.includes('textil') || c.includes('apparel') || c.includes('saree') || c.includes('cloth') || c.includes('shawl')) return { mat: '600', lab: '450', pkg: '60', margin: '30' };
  if (c.includes('pot') || c.includes('vase') || c.includes('terracotta') || c.includes('clay')) return { mat: '180', lab: '240', pkg: '70', margin: '30' };
  if (c.includes('wood') || c.includes('metal') || c.includes('brass')) return { mat: '550', lab: '500', pkg: '80', margin: '35' };
  if (c.includes('bag') || c.includes('leather') || c.includes('jute')) return { mat: '380', lab: '320', pkg: '50', margin: '30' };
  if (c.includes('decor') || c.includes('painting') || c.includes('art')) return { mat: '320', lab: '400', pkg: '60', margin: '30' };
  return { mat: '280', lab: '220', pkg: '40', margin: '30' };
};

export function PricingScreen({ category, onBack, onContinue }: PricingScreenProps) {
  const initial = getCategoryDefaults(category);
  const [materialCost, setMaterialCost] = useState(initial.mat);
  const [labourCost, setLabourCost] = useState(initial.lab);
  const [packagingCost, setPackagingCost] = useState(initial.pkg);
  const [margin, setMargin] = useState(initial.margin);
  const [activeCategory, setActiveCategory] = useState(category);
  const [result, setResult] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (
    customMat = materialCost,
    customLab = labourCost,
    customPkg = packagingCost,
    customMargin = margin,
    cat = activeCategory
  ): Promise<void> => {
    setLoading(true);
    try {
      const mat = Number(customMat) || 0;
      const lab = Number(customLab) || 0;
      const pkg = Number(customPkg) || 0;
      const next = await calculatePrice({
        materialCost: mat,
        labourCost: lab,
        packagingCost: pkg,
        marginPercentage: Number(customMargin) || 30,
        category: cat,
      });
      setResult({
        ...next,
        materialCost: mat,
        labourCost: lab,
        packagingCost: pkg,
      });
    } catch (err) {
      console.warn('Calculate price error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: typeof CATEGORY_PRESETS[0]) => {
    setMaterialCost(preset.mat);
    setLabourCost(preset.lab);
    setPackagingCost(preset.pkg);
    setMargin(preset.margin);
    setActiveCategory(preset.key);
    calculate(preset.mat, preset.lab, preset.pkg, preset.margin, preset.key);
  };

  useEffect(() => {
    calculate(initial.mat, initial.lab, initial.pkg, initial.margin, category);
  }, [category]);

  const totalDirectCost = (Number(materialCost) || 0) + (Number(labourCost) || 0) + (Number(packagingCost) || 0);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <WorkflowHeader activeStep="price" />
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back to catalog</Text>
        </TouchableOpacity>

        <View style={styles.kickerRow}>
          <Text style={styles.kicker}>FAIR ARTISAN PRICING</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{activeCategory || category}</Text></View>
        </View>

        <Text style={styles.title}>Price your work with confidence.</Text>
        <Text style={styles.subtitle}>Transparent, auditable calculation that values your artisan time and skills.</Text>

        <Text style={styles.sectionHeader}>Quick category presets</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
          {CATEGORY_PRESETS.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => applyPreset(item)}
              style={[styles.presetChip, activeCategory.toLowerCase().includes(item.key) ? styles.presetChipActive : null]}
            >
              <Text style={[styles.presetChipText, activeCategory.toLowerCase().includes(item.key) ? styles.presetChipTextActive : null]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.costBox}>
          <View style={styles.row}>
            <CostInput label="Raw Material" hint="Cloth, clay, stone" value={materialCost} onChangeText={setMaterialCost} />
            <CostInput label="Artisan Labour" hint="Your time & effort" value={labourCost} onChangeText={setLabourCost} />
          </View>
          <View style={styles.row}>
            <CostInput label="Packaging & Box" hint="Eco wraps, bubble" value={packagingCost} onChangeText={setPackagingCost} />
            <CostInput label="Profit Margin %" hint="Fair return (20-40%)" value={margin} onChangeText={setMargin} />
          </View>

          <View style={styles.quickMarginRow}>
            <Text style={styles.marginHint}>Quick margin:</Text>
            {['20', '25', '30', '35', '40'].map((mVal) => (
              <TouchableOpacity
                key={mVal}
                onPress={() => {
                  setMargin(mVal);
                  calculate(materialCost, labourCost, packagingCost, mVal, activeCategory);
                }}
                style={[styles.marginPill, margin === mVal ? styles.marginPillActive : null]}
              >
                <Text style={[styles.marginPillText, margin === mVal ? styles.marginPillTextActive : null]}>{mVal}%</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.summaryBar}>
            <Text style={styles.summaryBarLabel}>Direct Cost Base:</Text>
            <Text style={styles.summaryBarValue}>₹{totalDirectCost}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={() => calculate()} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#C85A32" size="small" />
          ) : (
            <Text style={styles.calculateText}>⚡ Recalculate Fair Price</Text>
          )}
        </TouchableOpacity>

        {result ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>RECOMMENDED SELLING PRICE</Text>
              <View style={styles.fairBadge}>
                <Text style={styles.fairBadgeText}>Fair Trade Verified</Text>
              </View>
            </View>
            <Text style={styles.price}>₹{result.recommendedPrice}</Text>
            <View style={styles.rangePill}>
              <Text style={styles.rangeText}>Safe Negotiation Range: ₹{result.minPrice} — ₹{result.maxPrice}</Text>
            </View>

            <View style={styles.costBreakdownRow}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Direct Cost</Text>
                <Text style={styles.breakdownValue}>₹{result.totalCost}</Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Margin</Text>
                <Text style={styles.breakdownValue}>{result.marginPercentage}%</Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Profit Target</Text>
                <Text style={styles.breakdownValue}>+₹{Math.max(0, result.recommendedPrice - result.totalCost)}</Text>
              </View>
            </View>

            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>Transparent Pricing Rationale:</Text>
              {result.explanation.map((line, idx) => (
                <Text style={styles.explanation} key={idx}>✓ {line}</Text>
              ))}
            </View>
          </View>
        ) : null}

        {result ? (
          <TouchableOpacity style={styles.primaryButton} onPress={() => onContinue(result)}>
            <Text style={styles.primaryText}>Continue to Final Review</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CostInput({ label, hint, value, onChangeText }: { label: string; hint: string; value: string; onChangeText: (value: string) => void }) {
  return (
    <View style={styles.costInput}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Text style={styles.rupee}>₹</Text>
        <TextInput
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#A49F96"
        />
      </View>
      <Text style={styles.inputHint}>{hint}</Text>
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
  badge: { backgroundColor: '#EDE3D2', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { color: '#594A38', fontSize: 11, fontWeight: '700' },
  title: { color: '#1E3A2F', fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#6F736D', fontSize: 14, lineHeight: 21, marginTop: 6 },
  sectionHeader: { color: '#1E3A2F', fontSize: 13, fontWeight: '800', marginTop: 18, marginBottom: 8 },
  presetRow: { flexDirection: 'row', gap: 8, paddingBottom: 6 },
  presetChip: { backgroundColor: '#F0E9DF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#DDD4C7' },
  presetChipActive: { backgroundColor: '#1E3A2F', borderColor: '#1E3A2F' },
  presetChipText: { color: '#4A463F', fontSize: 12, fontWeight: '700' },
  presetChipTextActive: { color: '#FAF7F2' },
  costBox: { backgroundColor: '#FFFDF9', borderRadius: 18, borderWidth: 1, borderColor: '#E5DED4', padding: 16, marginTop: 14 },
  row: { flexDirection: 'row', gap: 12 },
  costInput: { flex: 1 },
  label: { color: '#1E3A2F', fontSize: 12, fontWeight: '800', marginTop: 10, marginBottom: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAF7F2', borderWidth: 1, borderColor: '#D8D0C3', borderRadius: 10, minHeight: 46, paddingHorizontal: 10 },
  rupee: { color: '#7B766E', fontSize: 15, fontWeight: '700' },
  input: { flex: 1, color: '#1E3A2F', fontSize: 15, fontWeight: '700', paddingLeft: 6 },
  inputHint: { color: '#918D84', fontSize: 11, marginTop: 3 },
  quickMarginRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEE7DD' },
  marginHint: { color: '#6F736D', fontSize: 12, fontWeight: '700' },
  marginPill: { backgroundColor: '#F0E9DF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  marginPillActive: { backgroundColor: '#C85A32' },
  marginPillText: { color: '#594A38', fontSize: 12, fontWeight: '700' },
  marginPillTextActive: { color: '#FFF' },
  summaryBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, backgroundColor: '#F5EFE6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  summaryBarLabel: { color: '#594A38', fontSize: 12, fontWeight: '700' },
  summaryBarValue: { color: '#1E3A2F', fontSize: 14, fontWeight: '800' },
  calculateButton: { borderWidth: 1.5, borderColor: '#C85A32', minHeight: 48, borderRadius: 12, marginTop: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF9' },
  calculateText: { color: '#C85A32', fontSize: 15, fontWeight: '800' },
  resultCard: { backgroundColor: '#EBF2E8', borderRadius: 18, marginTop: 18, padding: 18, borderWidth: 1, borderColor: '#C8D9C2' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { color: '#3A5C41', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  fairBadge: { backgroundColor: '#D4E6CF', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  fairBadgeText: { color: '#2C4E33', fontSize: 10, fontWeight: '800' },
  price: { color: '#1E3A2F', fontSize: 38, fontWeight: '900', marginTop: 4 },
  rangePill: { backgroundColor: '#DDEBD7', alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
  rangeText: { color: '#2C4E33', fontSize: 13, fontWeight: '700' },
  costBreakdownRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginTop: 14, alignItems: 'center' },
  breakdownItem: { flex: 1, alignItems: 'center' },
  breakdownDivider: { width: 1, height: 26, backgroundColor: '#E4DFD5' },
  breakdownLabel: { color: '#7A8078', fontSize: 11, fontWeight: '700' },
  breakdownValue: { color: '#1E3A2F', fontSize: 14, fontWeight: '800', marginTop: 2 },
  explanationBox: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#D3E2CD' },
  explanationTitle: { color: '#2C4E33', fontSize: 12, fontWeight: '800', marginBottom: 4 },
  explanation: { color: '#445D48', fontSize: 12, lineHeight: 18, marginTop: 2 },
  primaryButton: { backgroundColor: '#C85A32', minHeight: 56, borderRadius: 16, marginTop: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryText: { color: '#FFF9F2', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFF9F2', fontSize: 24 },
});
