const fs = require('fs');

const part1 = JSON.parse(fs.readFileSync('./data/symptoms-part1.json', 'utf8'));
const part2 = JSON.parse(fs.readFileSync('./data/symptoms-part2.json', 'utf8'));

const merged = { categories: [...part1.categories, ...part2.categories] };

// 强制 UTF-8 写出
fs.writeFileSync('./data/symptoms.json', JSON.stringify(merged, null, 2), 'utf8');

// 验证：统计每个分类的症状数
console.log('分类总数：', merged.categories.length);
merged.categories.forEach(c => {
  console.log(`  ${c.name}：${c.symptoms.length} 个症状`);
});

// 简易繁体检查：抽查是否包含常见简体字
const text = JSON.stringify(merged);
const simplifiedChars = ['头', '觉', '医', '内', '风', '脏', '发', '烧', '肿', '晕', '晕', '泻', '肠', '肾', '脏'];
const found = simplifiedChars.filter(c => text.includes(c));
console.log('简体字抽查：', found.length === 0 ? '未发现' : `发现 ${found.join('、')}`);