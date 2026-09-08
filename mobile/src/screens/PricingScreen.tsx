import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WorkflowHeader } from '../components/WorkflowHeader';
import { calculatePrice, type PricingResponse } from '../services/api';

interface PricingScreenProps {
  category: string;
  onBack: () => void;
  onContinue: (result: PricingResponse) => void;
}

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
  const [result, setResult] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (
    customMat = materialCost,
    customLab = labourCost,
    customPkg = packagingCost,
    customMargin = margin
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
        category,
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

  useEffect(() => {
    calculate(initial.mat, initial.lab, initial.pkg, initial.margin);
  }, [category]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <WorkflowHeader activeStep="price" />
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.kicker}>SMART PRICING</Text>
        <Text style={styles.title}>Price your work with confidence.</Text>
        <Text style={styles.subtitle}>Add your costs. We will show a transparent range you can review.</Text>

        <View style={styles.row}>
          <CostInput label="Material" value={materialCost} onChangeText={setMaterialCost} />
          <CostInput label="Labour" value={labourCost} onChangeText={setLabourCost} />
        </View>
        <View style={styles.row}>
          <CostInput label="Packaging" value={packagingCost} onChangeText={setPackagingCost} />
          <CostInput label="Margin %" value={margin} onChangeText={setMargin} />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#B65332" size="small" />
          ) : (
            <Text style={styles.calculateText}>Calculate a price</Text>
          )}
        </TouchableOpacity>

        {result ? (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>RECOMMENDED PRICE</Text>
            <Text style={styles.price}>₹{result.recommendedPrice}</Text>
            <Text style={styles.range}>₹{result.minPrice} - ₹{result.maxPrice}</Text>
            <Text style={styles.total}>Total cost ₹{result.totalCost} · Margin {result.marginPercentage}%</Text>
            {result.explanation.map((line) => (
              <Text style={styles.explanation} key={line}>• {line}</Text>
            ))}
          </View>
        ) : null}

        {result ? (
          <TouchableOpacity style={styles.primaryButton} onPress={() => onContinue(result)}>
            <Text style={styles.primaryText}>Review product</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CostInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return (
    <View style={styles.costInput}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Text style={styles.rupee}>₹</Text>
        <TextInput keyboardType="numeric" value={value} onChangeText={onChangeText} style={styles.input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F3EC' },
  content: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 50 },
  backButton: { paddingVertical: 8, alignSelf: 'flex-start' },
  backText: { color: '#53665A', fontSize: 15, fontWeight: '700' },
  kicker: { color: '#D96C45', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 18 },
  title: { color: '#263B35', fontSize: 29, lineHeight: 35, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#6F736D', fontSize: 15, lineHeight: 22, marginTop: 8 },
  row: { flexDirection: 'row', gap: 12 },
  costInput: { flex: 1 },
  label: { color: '#263B35', fontSize: 13, fontWeight: '800', marginTop: 17, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#DED8CF', borderRadius: 11, minHeight: 46, paddingHorizontal: 11 },
  rupee: { color: '#7B766E', fontSize: 15 },
  input: { flex: 1, color: '#263B35', fontSize: 15, paddingLeft: 5 },
  calculateButton: { borderWidth: 1.5, borderColor: '#D96C45', minHeight: 52, borderRadius: 14, marginTop: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF9' },
  calculateText: { color: '#B65332', fontSize: 16, fontWeight: '800' },
  result: { backgroundColor: '#E8F0E3', borderRadius: 16, marginTop: 20, padding: 18 },
  resultLabel: { color: '#53725C', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  price: { color: '#263B35', fontSize: 38, fontWeight: '800', marginTop: 4 },
  range: { color: '#53725C', fontSize: 15, fontWeight: '700' },
  total: { color: '#6F736D', fontSize: 12, marginTop: 7 },
  explanation: { color: '#53665A', fontSize: 12, marginTop: 5 },
  primaryButton: { backgroundColor: '#D96C45', minHeight: 56, borderRadius: 16, marginTop: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryText: { color: '#FFF9F2', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFF9F2', fontSize: 25 },
});
