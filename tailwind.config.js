module.exports = {
  purge: [
    'layout.ejs',
    'index.ejs' //add 404.ejs later
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        red: {
          100: '#fff5f5',
          200: '#fed7d7',
          300: '#feb2b2',
          400: '#FA7268',
          500: '#f56565',
          600: '#E53E3E',
          700: '#c53030',
          800: '#9b2c2c',
          900: '#742a2a'
        },
        black: '#002233'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
}