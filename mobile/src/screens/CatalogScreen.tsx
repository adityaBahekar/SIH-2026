import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WorkflowHeader } from '../components/WorkflowHeader';
import type { CatalogResponse } from '../services/api';

interface CatalogScreenProps {
  catalog: CatalogResponse;
  onContinue: (catalog: CatalogResponse) => void;
  onBack: () => void;
}

export function CatalogScreen({ catalog, onContinue, onBack }: CatalogScreenProps) {
  const [draft, setDraft] = useState<CatalogResponse>(catalog);
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const [tagInput, setTagInput] = useState('');

  const update = <K extends keyof CatalogResponse>(key: K, value: CatalogResponse[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !draft.keywords.includes(trimmed)) {
      update('keywords', [...draft.keywords, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    update('keywords', draft.keywords.filter((t) => t !== tagToRemove));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <WorkflowHeader activeStep="catalog" />
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back to studio</Text>
        </TouchableOpacity>

        <View style={styles.kickerRow}>
          <Text style={styles.kicker}>AI SMART CATALOG</Text>
          {draft.demoMode ? (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>Demo suggestions</Text>
            </View>
          ) : (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>✓ Gemini Multimodal</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>Review your product catalog</Text>
        <Text style={styles.subtitle}>Our AI extracted key details from your image. You can customize any field to perfection.</Text>

        {/* SECTION 1: CRAFT IDENTITY */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🏺</Text>
            <Text style={styles.cardTitle}>Craft Identity & Origin</Text>
          </View>

          <Text style={styles.label}>Product Title *</Text>
          <TextInput
            value={draft.title}
            onChangeText={(v) => update('title', v)}
            style={styles.input}
            placeholder="e.g. Handcrafted Terracotta Floral Vase"
            placeholderTextColor="#9A968D"
          />

          <View style={styles.twoCol}>
            <View style={styles.half}>
              <Text style={styles.label}>Category *</Text>
              <TextInput
                value={draft.category}
                onChangeText={(v) => update('category', v)}
                style={styles.input}
                placeholder="e.g. Pottery"
                placeholderTextColor="#9A968D"
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Craft Technique</Text>
              <TextInput
                value={draft.technique ?? ''}
                onChangeText={(v) => update('technique', v || null)}
                style={styles.input}
                placeholder="e.g. Handloom, Carving"
                placeholderTextColor="#9A968D"
              />
            </View>
          </View>

          <Text style={styles.label}>Heritage Origin / Region</Text>
          <TextInput
            value={draft.origin ?? ''}
            onChangeText={(v) => update('origin', v || null)}
            style={styles.input}
            placeholder="e.g. Jaipur, Rajasthan or Varanasi, UP"
            placeholderTextColor="#9A968D"
          />
        </View>

        {/* SECTION 2: SPECIFICATIONS & INVENTORY */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📐</Text>
            <Text style={styles.cardTitle}>Specifications & Stock</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.half}>
              <Text style={styles.label}>Material</Text>
              <TextInput
                value={draft.material ?? ''}
                onChangeText={(v) => update('material', v || null)}
                style={styles.input}
                placeholder="e.g. Terracotta Clay, Silk"
                placeholderTextColor="#9A968D"
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Color Palette</Text>
              <TextInput
                value={draft.color ?? ''}
                onChangeText={(v) => update('color', v || null)}
                style={styles.input}
                placeholder="e.g. Crimson Red, Earth"
                placeholderTextColor="#9A968D"
              />
            </View>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.half}>
              <Text style={styles.label}>Dimensions / Size</Text>
              <TextInput
                value={draft.dimensions ?? ''}
                onChangeText={(v) => update('dimensions', v || null)}
                style={styles.input}
                placeholder="e.g. 10 x 6 x 4 in"
                placeholderTextColor="#9A968D"
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Weight</Text>
              <TextInput
                value={draft.weight ?? ''}
                onChangeText={(v) => update('weight', v || null)}
                style={styles.input}
                placeholder="e.g. 450 grams"
                placeholderTextColor="#9A968D"
              />
            </View>
          </View>

          <Text style={styles.label}>Available Stock (Units)</Text>
          <TextInput
            keyboardType="numeric"
            value={String(draft.stock ?? 5)}
            onChangeText={(v) => update('stock', Number(v) || 0)}
            style={styles.input}
            placeholder="5"
            placeholderTextColor="#9A968D"
          />
        </View>

        {/* SECTION 3: BILINGUAL DESCRIPTIONS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📖</Text>
            <Text style={styles.cardTitle}>Product Story (Bilingual)</Text>
          </View>

          <View style={styles.langTabRow}>
            <TouchableOpacity
              onPress={() => setActiveLang('en')}
              style={[styles.langTab, activeLang === 'en' ? styles.langTabActive : null]}
            >
              <Text style={[styles.langTabText, activeLang === 'en' ? styles.langTabTextActive : null]}>🌐 English Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveLang('hi')}
              style={[styles.langTab, activeLang === 'hi' ? styles.langTabActive : null]}
            >
              <Text style={[styles.langTabText, activeLang === 'hi' ? styles.langTabTextActive : null]}>🇮🇳 हिंदी विवरण</Text>
            </TouchableOpacity>
          </View>

          {activeLang === 'en' ? (
            <View>
              <Text style={styles.langHelp}>Suitable for national & global e-commerce buyers:</Text>
              <TextInput
                multiline
                value={draft.descriptionEn}
                onChangeText={(v) => update('descriptionEn', v)}
                style={[styles.input, styles.textarea]}
                textAlignVertical="top"
              />
            </View>
          ) : (
            <View>
              <Text style={styles.langHelp}>स्थानीय मेलों, ग्राहकों और भारतीय खरीदारों के लिए:</Text>
              <TextInput
                multiline
                value={draft.descriptionHi}
                onChangeText={(v) => update('descriptionHi', v)}
                style={[styles.input, styles.textarea]}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>

        {/* SECTION 4: CARE & SEARCH TAGS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🧼</Text>
            <Text style={styles.cardTitle}>Care Instructions & Search Tags</Text>
          </View>

          <Text style={styles.label}>Care Instructions for Customer</Text>
          <TextInput
            multiline
            value={draft.careInstructions ?? ''}
            onChangeText={(v) => update('careInstructions', v || null)}
            style={[styles.input, styles.shortTextarea]}
            placeholder="e.g. Wipe with a dry soft cotton cloth. Keep away from direct moisture."
            placeholderTextColor="#9A968D"
            textAlignVertical="top"
          />

          <Text style={styles.label}>Marketplace Search Tags</Text>
          <View style={styles.tagWrap}>
            {draft.keywords.map((tag, idx) => (
              <View key={idx} style={styles.tagChip}>
                <Text style={styles.tagChipText}>#{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)} style={styles.tagRemove}>
                  <Text style={styles.tagRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.tagInputRow}>
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              style={[styles.input, styles.tagInputField]}
              placeholder="Add tag (e.g. handmade, vintage)..."
              placeholderTextColor="#9A968D"
              onSubmitEditing={addTag}
            />
            <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
              <Text style={styles.addTagText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => onContinue(draft)}>
          <Text style={styles.primaryText}>Continue to Fair Pricing</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7F2' },
  content: { paddingHorizontal: 22, paddingTop: 38, paddingBottom: 50 },
  backButton: { paddingVertical: 8, alignSelf: 'flex-start' },
  backText: { color: '#445D48', fontSize: 14, fontWeight: '700' },
  kickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  kicker: { color: '#C85A32', fontSize: 12, fontWeight: '800', letterSpacing: 1.1 },
  demoBadge: { backgroundColor: '#F9ECE5', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  demoBadgeText: { color: '#9A634F', fontSize: 11, fontWeight: '700' },
  aiBadge: { backgroundColor: '#E3ECE3', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  aiBadgeText: { color: '#2F5938', fontSize: 11, fontWeight: '800' },
  title: { color: '#1E3A2F', fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#6F736D', fontSize: 14, lineHeight: 21, marginTop: 6 },
  card: { backgroundColor: '#FFFDF9', borderRadius: 18, borderWidth: 1, borderColor: '#E5DED4', padding: 16, marginTop: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F0EAE1' },
  cardIcon: { fontSize: 18 },
  cardTitle: { color: '#1E3A2F', fontSize: 15, fontWeight: '800' },
  label: { color: '#1E3A2F', fontSize: 12, fontWeight: '800', marginTop: 10, marginBottom: 5 },
  input: { backgroundColor: '#FAF7F2', borderWidth: 1, borderColor: '#D8D0C3', borderRadius: 10, minHeight: 44, paddingHorizontal: 12, color: '#1E3A2F', fontSize: 14 },
  textarea: { minHeight: 90, paddingTop: 10 },
  shortTextarea: { minHeight: 65, paddingTop: 8 },
  twoCol: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  langTabRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  langTab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: '#F0E9DF' },
  langTabActive: { backgroundColor: '#1E3A2F' },
  langTabText: { color: '#594A38', fontSize: 13, fontWeight: '700' },
  langTabTextActive: { color: '#FAF7F2' },
  langHelp: { color: '#7E7A71', fontSize: 12, marginBottom: 6, fontStyle: 'italic' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4, marginBottom: 10 },
  tagChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE5D8', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4, gap: 6 },
  tagChipText: { color: '#594A38', fontSize: 12, fontWeight: '700' },
  tagRemove: { padding: 2 },
  tagRemoveText: { color: '#884D3C', fontSize: 14, fontWeight: '900' },
  tagInputRow: { flexDirection: 'row', gap: 8 },
  tagInputField: { flex: 1 },
  addTagButton: { backgroundColor: '#1E3A2F', borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
  addTagText: { color: '#FFF9F2', fontSize: 13, fontWeight: '700' },
  primaryButton: { backgroundColor: '#C85A32', minHeight: 56, borderRadius: 16, marginTop: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryText: { color: '#FFF9F2', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFF9F2', fontSize: 24 },
});
