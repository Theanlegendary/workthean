import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('C:/Users/DELL/.gemini/antigravity/scratch/workthean/js/split-jobs.js', 'r', encoding='utf-8') as f:
    c = f.read()

pos = c.find('function generateJobCardHtml')
print(c[pos:pos+1000])
