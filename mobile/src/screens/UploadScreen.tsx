import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useExamStore } from '../stores/examStore';
import { COLORS, SUBJECTS, EXAM_TYPES, GRADES } from '../constants';

export default function UploadScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [subject, setSubject] = useState('math');
  const [grade, setGrade] = useState(1);
  const [examType, setExamType] = useState('practice');
  
  const { uploadExam, isLoading, error } = useExamStore();

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(a => a.uri)]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相机权限才能拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      Alert.alert('提示', '请至少选择一张试卷图片');
      return;
    }

    const formData = new FormData();
    images.forEach((uri, index) => {
      const filename = uri.split('/').pop() || `image_${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('images', {
        uri,
        name: filename,
        type
      } as any);
    });

    formData.append('subject', subject);
    formData.append('grade', grade.toString());
    formData.append('examType', examType);

    try {
      await uploadExam(formData);
      Alert.alert('成功', '试卷上传成功！');
      setImages([]);
    } catch (err) {
      Alert.alert('上传失败', error || '请稍后重试');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>试卷图片</Text>
        <View style={styles.imagesContainer}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
            <Text style={styles.addImageText}>+</Text>
            <Text style={styles.addImageLabel}>相册</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addImageButton} onPress={takePhoto}>
            <Text style={styles.addImageText}>📷</Text>
            <Text style={styles.addImageLabel}>拍照</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学科</Text>
        <View style={styles.optionsRow}>
          {SUBJECTS.slice(0, 4).map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.optionButton, subject === s.id && styles.optionActive]}
              onPress={() => setSubject(s.id)}
            >
              <Text style={[styles.optionText, subject === s.id && styles.optionTextActive]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>年级</Text>
        <View style={styles.optionsRow}>
          {GRADES.slice(0, 6).map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[styles.optionButton, grade === g.value && styles.optionActive]}
              onPress={() => setGrade(g.value)}
            >
              <Text style={[styles.optionText, grade === g.value && styles.optionTextActive]}>
                {g.value}年级
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>试卷类型</Text>
        <View style={styles.optionsRow}>
          {EXAM_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.optionButton, examType === t.value && styles.optionActive]}
              onPress={() => setExamType(t.value)}
            >
              <Text style={[styles.optionText, examType === t.value && styles.optionTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, (isLoading || images.length === 0) && styles.buttonDisabled]}
        onPress={handleUpload}
        disabled={isLoading || images.length === 0}
      >
        <Text style={styles.uploadButtonText}>
          {isLoading ? '上传中...' : '上传试卷'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: 20
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  imageWrapper: {
    width: 80,
    height: 80,
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface
  },
  addImageText: {
    fontSize: 24,
    color: COLORS.textSecondary
  },
  addImageLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  optionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '500'
  },
  uploadButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  buttonDisabled: {
    opacity: 0.6
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
