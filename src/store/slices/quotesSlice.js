import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchQuote = createAsyncThunk(
    'quotes/fetch',
    async () => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    Origin: 'www.example.com',
                    'X-Requested-With': 'www.example.com',
                    'X-RapidAPI-Key': '576fa3a9e0msh0687432b36c8ba2p1cc44ejsn4a31533892af',
                    'X-RapidAPI-Host': 'http-cors-proxy.p.rapidapi.com'
                },
                body: '{"url":"http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru"}'
            };

            const response = await fetch('https://http-cors-proxy.p.rapidapi.com/', options)
            const data = await response.json()
            return data.quoteText
        } catch (err) {
            console.log(err.message)
        }
    }
)

const quotesSlice = createSlice({
    name: 'qouteSlice',
    initialState: {
        quotes: '',
    },
    reducers: {},
    extraReducers: {
        [fetchQuote.fullifiled]: (state, action) => {
            state.quote = action.payload
        },
        [fetchQuote.rejected]: (state) => {
            state.quote = 'Сегодня без мотивационки'
        }
    }
})

export default quotesSlice.reducer