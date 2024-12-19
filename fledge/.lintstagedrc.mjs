export default {
  '!(*.ts)': 'prettier --write --ignore-unknown',
  '*.ts': [
    'tsc --noEmit --skipLibCheck --esModuleInterop --target esnext --module nodenext --moduleResolution nodenext',
    'eslint --fix',
    'prettier --write',
  ],
};
