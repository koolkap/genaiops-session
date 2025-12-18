import streamlit as st
st.set_page_config(page_title='HR & IT Support Bot')
st.title('HR & IT Support Bot')
question = st.text_input('Ask a question')
if question:
    st.write('Answer will appear here with citations')