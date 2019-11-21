const router = require('express').Router()
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const axios = require('axios')
const queryString = require('query-string');
//imports .env variables
require('dotenv').config()
//models
const Theater = require('../models/theater.model')
const Movie = require('../models/movie.model')
/*=====  Test entries  ======*/
let theaters = ['AMC PACIFIC PLACE 11']
let dates = ['2019-11-17']
/*=============================================
=            Helper Functions            =
=============================================*/
let test1 = [{
    name: 'NT Live: Fleabag',
    times: ['7:00p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219694/Fleabag_NT_Keyart_250x375.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=294257001&tid=aaiya&sdate=2019-11-18+19:00&mid=219694&from=mov_det_showtimes']
},
{
    name: 'Princess Mononoke – Studio Ghibli Fest 2019',
    times: ['7:00p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/217390/princess%20mononoke.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=264129918&tid=aaiya&sdate=2019-11-18+19:00&mid=217390&from=mov_det_showtimes']
},
{
    name: 'Charlie\'s Angels',
    times: ['1:50p', '4:45p', '7:45p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219167/charlies-angels-CA_OnLine_1SHT_.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=292293895&tid=aaiya&sdate=2019-11-18+13:50&mid=219167&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=292293896&tid=aaiya&sdate=2019-11-18+16:45&mid=219167&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=292293897&tid=aaiya&sdate=2019-11-18+19:45&mid=219167&from=mov_det_showtimes']
},
{
    name: 'Somewhere Winter',
    times: ['1:30p', '4:30p', '7:35p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/221296/SomewhereWinter_WebFriendlyPoster.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060447&tid=aaiya&sdate=2019-11-18+13:30&mid=221296&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060448&tid=aaiya&sdate=2019-11-18+16:30&mid=221296&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060449&tid=aaiya&sdate=2019-11-18+19:35&mid=221296&from=mov_det_showtimes']
},
{
    name: 'The Good Liar',
    times: ['1:55p', '4:40p', '7:30p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219273/TheGoodLiar2019.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300321157&tid=aaiya&sdate=2019-11-18+13:55&mid=219273&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300321158&tid=aaiya&sdate=2019-11-18+16:40&mid=219273&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300321159&tid=aaiya&sdate=2019-11-18+19:30&mid=219273&from=mov_det_showtimes']
},
{
    name: 'Better Days',
    times: ['1:55p', '5:00p', '8:00p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219190/BetterDays-Poster-1382x2048.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060384&tid=aaiya&sdate=2019-11-18+13:55&mid=219190&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060385&tid=aaiya&sdate=2019-11-18+17:00&mid=219190&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060386&tid=aaiya&sdate=2019-11-18+20:00&mid=219190&from=mov_det_showtimes']
},
{
    name: 'Doctor Sleep',
    times: ['3:30p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219234/DRSLP_VERT_MAIN_DOM_2764x4096_master.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060446&tid=aaiya&sdate=2019-11-18+15:30&mid=219234&from=mov_det_showtimes']
},
{
    name: 'Jojo Rabbit',
    times: ['1:35p', '4:55p', '7:25p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219662/JOJO_DIGITAL_CAST_Dots_1334x2000_Poster_FIN.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060415&tid=aaiya&sdate=2019-11-18+13:35&mid=219662&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060403&tid=aaiya&sdate=2019-11-18+16:55&mid=219662&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060416&tid=aaiya&sdate=2019-11-18+19:25&mid=219662&from=mov_det_showtimes']
},
{
    name: 'Last Christmas',
    times: ['1:30p', '4:10p', '8:00p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219795/LastChristmas2019.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060433&tid=aaiya&sdate=2019-11-18+13:30&mid=219795&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060431&tid=aaiya&sdate=2019-11-18+16:10&mid=219795&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060399&tid=aaiya&sdate=2019-11-18+20:00&mid=219795&from=mov_det_showtimes']
},
{
    name: 'Midway',
    times: ['3:20p', '7:00p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219391/midway-final-poster.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060414&tid=aaiya&sdate=2019-11-18+15:20&mid=219391&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060413&tid=aaiya&sdate=2019-11-18+19:00&mid=219391&from=mov_det_showtimes']
},
{
    name: 'Parasite',
    times: ['1:45p', '4:15p', '7:50p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219062/Parasite2019.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060401&tid=aaiya&sdate=2019-11-18+13:45&mid=219062&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060417&tid=aaiya&sdate=2019-11-18+16:15&mid=219062&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060402&tid=aaiya&sdate=2019-11-18+19:50&mid=219062&from=mov_det_showtimes']
},
{
    name: 'Maleficent: Mistress of Evil',
    times: ['2:05p', '5:05p', '7:40p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/218843/Maleficent25d48787443c8d.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060432&tid=aaiya&sdate=2019-11-18+14:05&mid=218843&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060398&tid=aaiya&sdate=2019-11-18+17:05&mid=218843&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060430&tid=aaiya&sdate=2019-11-18+19:40&mid=218843&from=mov_det_showtimes']
},
{
    name: 'Joker',
    times: ['1:40p', '4:40p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/214548/JOKER_VERT_MAIN_DOM_2764x4096_master.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301102603&tid=aaiya&sdate=2019-11-18+13:40&mid=214548&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301060434&tid=aaiya&sdate=2019-11-18+16:40&mid=214548&from=mov_det_showtimes']
},
{
    theaterName: 'AMC PACIFIC PLACE 11',
    address: '600 Pine S., Seattle, WA 98101'
}]

let test2 = [{
    name: 'Ford v Ferrari',
    times: ['12:00p', '3:15p', '6:30p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/207162/FVF_Pitlane__VerB_Poster_05.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300262107&tid=aapbq&sdate=2019-11-18+12:00&mid=207162&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300262108&tid=aapbq&sdate=2019-11-18+15:15&mid=207162&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300265461&tid=aapbq&sdate=2019-11-18+18:30&mid=207162&from=mov_det_showtimes']
},
{
    name: 'Harriet',
    times: ['12:15p', '3:45p', '6:45p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219554/Harriet_Final_One_Sheet_FB_IG.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300509431&tid=aapbq&sdate=2019-11-18+12:15&mid=219554&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300509434&tid=aapbq&sdate=2019-11-18+15:45&mid=219554&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300509439&tid=aapbq&sdate=2019-11-18+18:45&mid=219554&from=mov_det_showtimes']
},
{
    name: 'Joker',
    times: ['12:30p', '3:30p', '7:15p'],
    date: '2019-11-18',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/214548/JOKER_VERT_MAIN_DOM_2764x4096_master.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300509444&tid=aapbq&sdate=2019-11-18+12:30&mid=214548&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300509447&tid=aapbq&sdate=2019-11-18+15:30&mid=214548&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300509452&tid=aapbq&sdate=2019-11-18+19:15&mid=214548&from=mov_det_showtimes']
},
{
    theaterName: 'MAJESTIC BAY THEATRE',
    address: '2044 N.W. Market St., Seattle, WA 98107'
}]

let test = [{
    name: 'Princess Mononoke – Studio Ghibli Fest 2019',
    times: ['12:55p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/217390/princess%20mononoke.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=264129915&tid=aaiya&sdate=2019-11-17+12:55&mid=217390&from=mov_det_showtimes']
},
{
    name: 'The Bolshoi Ballet: Le Corsaire',
    times: ['12:55p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/218719/1176_BolshoiLeCorsaire_250x375.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=274673460&tid=aaiya&sdate=2019-11-17+12:55&mid=218719&from=mov_det_showtimes']
},
{
    name: 'Charlie\'s Angels',
    times: ['11:00a', '1:50p', '4:45p', '7:40p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219167/charlies-angels-CA_OnLine_1SHT_.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=292293894&tid=aaiya&sdate=2019-11-17+11:00&mid=219167&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=292293891&tid=aaiya&sdate=2019-11-17+13:50&mid=219167&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=292293892&tid=aaiya&sdate=2019-11-17+16:45&mid=219167&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=292293893&tid=aaiya&sdate=2019-11-17+19:40&mid=219167&from=mov_det_showtimes']
},
{
    name: 'Somewhere Winter',
    times: ['11:05a', '1:35p', '4:35p', '8:05p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/221296/SomewhereWinter_WebFriendlyPoster.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046163&tid=aaiya&sdate=2019-11-17+11:05&mid=221296&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046227&tid=aaiya&sdate=2019-11-17+13:35&mid=221296&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046228&tid=aaiya&sdate=2019-11-17+16:35&mid=221296&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046164&tid=aaiya&sdate=2019-11-17+20:05&mid=221296&from=mov_det_showtimes']
},
{
    name: 'The Good Liar',
    times: ['11:20a', '2:05p', '4:50p', '7:45p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219273/TheGoodLiar2019.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300321153&tid=aaiya&sdate=2019-11-17+11:20&mid=219273&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300321154&tid=aaiya&sdate=2019-11-17+14:05&mid=219273&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300321155&tid=aaiya&sdate=2019-11-17+16:50&mid=219273&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=300321156&tid=aaiya&sdate=2019-11-17+19:45&mid=219273&from=mov_det_showtimes']
},
{
    name: 'Better Days',
    times: ['10:35a', '2:00p', '5:00p', '7:35p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219190/BetterDays-Poster-1382x2048.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046229&tid=aaiya&sdate=2019-11-17+10:35&mid=219190&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046165&tid=aaiya&sdate=2019-11-17+14:00&mid=219190&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046166&tid=aaiya&sdate=2019-11-17+17:00&mid=219190&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046230&tid=aaiya&sdate=2019-11-17+19:35&mid=219190&from=mov_det_showtimes']
},
{
    name: 'Doctor Sleep',
    times: ['4:00p', '7:30p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219234/DRSLP_VERT_MAIN_DOM_2764x4096_master.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=297002950&tid=aaiya&sdate=2019-11-17+16:00&mid=219234&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=297002949&tid=aaiya&sdate=2019-11-17+19:30&mid=219234&from=mov_det_showtimes']
},
{
    name: 'Jojo Rabbit',
    times: ['10:45a', '1:25p', '4:55p', '7:10p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219662/JOJO_DIGITAL_CAST_Dots_1334x2000_Poster_FIN.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046191&tid=aaiya&sdate=2019-11-17+10:45&mid=219662&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046192&tid=aaiya&sdate=2019-11-17+13:25&mid=219662&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046173&tid=aaiya&sdate=2019-11-17+16:55&mid=219662&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046193&tid=aaiya&sdate=2019-11-17+19:10&mid=219662&from=mov_det_showtimes']
},
{
    name: 'Last Christmas',
    times: ['10:55a', '2:15p', '4:40p', '8:00p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219795/LastChristmas2019.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046210&tid=aaiya&sdate=2019-11-17+10:55&mid=219795&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301090689&tid=aaiya&sdate=2019-11-17+14:15&mid=219795&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046211&tid=aaiya&sdate=2019-11-17+16:40&mid=219795&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046168&tid=aaiya&sdate=2019-11-17+20:00&mid=219795&from=mov_det_showtimes']
},
{
    name: 'Midway',
    times: ['10:50a', '3:20p', '7:00p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219391/midway-final-poster.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301090690&tid=aaiya&sdate=2019-11-17+10:50&mid=219391&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046189&tid=aaiya&sdate=2019-11-17+15:20&mid=219391&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046190&tid=aaiya&sdate=2019-11-17+19:00&mid=219391&from=mov_det_showtimes']
},
{
    name: 'Parasite',
    times: ['10:40a', '1:45p', '4:05p', '7:50p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/219062/Parasite2019.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046170&tid=aaiya&sdate=2019-11-17+10:40&mid=219062&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046171&tid=aaiya&sdate=2019-11-17+13:45&mid=219062&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046194&tid=aaiya&sdate=2019-11-17+16:05&mid=219062&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046172&tid=aaiya&sdate=2019-11-17+19:50&mid=219062&from=mov_det_showtimes']
},
{
    name: 'Maleficent: Mistress of Evil',
    times: ['1:40p', '5:05p', '7:25p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/218843/Maleficent25d48787443c8d.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046215&tid=aaiya&sdate=2019-11-17+13:40&mid=218843&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046169&tid=aaiya&sdate=2019-11-17+17:05&mid=218843&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046216&tid=aaiya&sdate=2019-11-17+19:25&mid=218843&from=mov_det_showtimes']
},
{
    name: 'Joker',
    times: ['5:10p', '8:05p'],
    date: '2019-11-17',
    poster:
        'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/MasterRepository/fandango/214548/JOKER_VERT_MAIN_DOM_2764x4096_master.jpg',
    links:
        ['https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046236&tid=aaiya&sdate=2019-11-17+17:10&mid=214548&from=mov_det_showtimes',
            'https://tickets.fandango.com/Transaction/Ticketing/ticketboxoffice.aspx?row_count=301046237&tid=aaiya&sdate=2019-11-17+20:05&mid=214548&from=mov_det_showtimes']
},
{
    theaterName: 'AMC PACIFIC PLACE 11',
    address: '600 Pine S., Seattle, WA 98101 '
}]

let genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

let getMovieInfo = (theater, dates) => {
    let nightmare = Nightmare();
    nightmare
        .goto(`https://www.fandango.com/`)
        .type('.style-search', theater)
        .click('.fan-btn-style-go')
        .wait(3000)
        .evaluate(() => { return document.querySelector('.search-results').innerHTML })
        .then(function (html) {
            let $ = cheerio.load(html);
            let items = []
            $('.results-container').each((i, el) => {
                items.push($(el).attr('href'))
            })
            //will need a regex to search for link containing the theater
            //better yet, just have a list of known seattle movie theaters
            //store the times for the day in a server  
            // console.log(items)
            return nightmare
                //after searching for the theater get and getting the correct link from the search results 
                .goto(items[0] + '?date=' + dates)
                .wait()
                //the primary container holding movie information 
                .evaluate(() => { return document.querySelector('#page').innerHTML })
                .end()
                .then((html2) => {
                    let $ = cheerio.load(html2)


                    let moviesAndTimes = []

                    //grab the address 
                    //get rid of newlines and extra whitespace
                    let address = $('.subnav__link-item--address').find('span').text().replace(/\n/gi, '').replace(/ +(?= )/g, "").trim()
                    //grab movie information 
                    $('.fd-movie').each((i, el) => {
                        //get ride of the '(year)'
                        let nameTrim = $(el).find('.fd-movie__title').find('a.dark').text()
                        if (nameTrim.indexOf('(') != -1) { nameTrim = nameTrim.substring(0, nameTrim.indexOf('(')).trim() }

                        let item = {
                            name: nameTrim,
                            times: `${$(el).find('.showtime-btn').text()}`,
                            date: dates,
                            poster: $(el).find('.fd-movie__poster').find('img').attr('src')
                        }
                        //had to get the links seperatly as it would only return one link if called within the 'item' object
                        let found = []

                        $(el).find('.showtime-btn--available').each((j, jl) => {

                            found.push(($(jl).attr('href')))
                        })

                        item.links = found

                        moviesAndTimes.push(item)
                    })

                    movieTimesFix(moviesAndTimes)
                    fixPosterLinks(moviesAndTimes)

                    moviesAndTimes.push({
                        theaterName: theater,
                        address: address
                    })
                    // console.log(moviesAndTimes)
                    return moviesAndTimes

                    /*=============================================
                    =            Add data to database           =
                    =============================================*/



                    /*=====  End of Add data to  ======*/


                })
        })
        .catch(error => {
            console.error('Search failed:', error)
        })
}
//this funciton will seperate and format the times pulled from fandango 
let movieTimesFix = movies => {
    movies.forEach(movie => {
        // grab the times and and insert commas next to the p and q so they stick around after split methods
        let newTimes = movie.times.replace(/p/gi, 'p,').replace(/a/gi, 'a,').split(',')
        //the end of the array always seems to be a blank value so get rid of it by changing the length of the array 
        newTimes.length = newTimes.length - 1
        // let splitTimes = movie.times.
        movie.times = newTimes
    });
    return movies
}
//a function the adds 'https:' to the begining of the poster link 
let fixPosterLinks = movies => {
    //iterate through each movie 
    movies.forEach(mov => {
        //grab the poster link 
        //add 'http:' to be front of the string 
        mov.poster = 'https:' + mov.poster
    })
}
//to maintain DRY when adding movies to db
let addMovies = (movies, searchBy, res, genreArr) => {

    Movie.insertMany(movies)
        .then(dbMovies => {
            //associate each movie with the theater 
            dbMovies.forEach(mov => {
                Theater.findOneAndUpdate(searchBy, { $push: { movies: mov.id } }, { new: true })
                    .then(() => {
                        //try adding the axios call here and update the movie entries 
                        let query = queryString.stringify({ query: mov.name })
                        // console.log(process.env.MOVIE_KEY)
                        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_KEY}&language=en-US&${query}&page=1&include_adult=false`).then(res => {
                            if (res.data.results[0] != undefined) {

                                let genres = []
                                //find and assign the genre using the provided ids
                                res.data.results[0].genre_ids.forEach(id => {
                                    genreArr.forEach(gen => {
                                        if (gen.id === id) {
                                            genres.push(gen.name)
                                        }
                                    })
                                })
                                //update movie entry 
                                Movie.findOneAndUpdate({ _id: mov.id }, { $set: { overview: res.data.results[0].overview, rating: res.data.results[0].vote_average }, genres: genres })
                                    .then(() => { })
                                    .catch(err => console.log(err))
                            }
                        })
                            .catch(err => console.log(err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err))
            })
            res.json('Movies added!')
        })
        .catch(err => res.status(400).json('Error: ' + err))
}

let addDataToDB = (data, res, genreArr) => {
    //the theater info will always be at the end of the array 
    let theaterInfo = data.slice(-1)
    let movieData = data.slice(0, -1)

    //add additional information to each movie
    // getMovieOverview(movieData, genres)

    const newTheater = {
        name: theaterInfo[0].theaterName,
        address: theaterInfo[0].address
    }
    //check if the theater already exsists in the Theater collection 
    Theater.countDocuments({ name: newTheater.name }, (err, test) => {
        //add the new theater if it does not exsist
        if (test === 0) {
            Theater.create(newTheater)
                .then(dbTheater => {
                    addMovies(movieData, { _id: dbTheater._id }, res, genreArr)
                })
                .catch(err => res.status(400).json('Error: ' + err))
        }
        else {
            addMovies(movieData, { name: newTheater.name }, res, genreArr)
        }
    })
}

let findClosestTheater = (theaters, location, res, movie) => {
    //create destination query 
    //with a single query, you can map the distance from one point to multiple points 
    let destinationQuery = '';
    theaters.forEach(t => {
        destinationQuery += queryString.stringify({ destinations: t[0].name }).slice(13) + '|'
    })
    //grab the distances 
    axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${location}&destinations=${destinationQuery}&key=${process.env.MAP_KEY}`)
        .then(result => {
            let distances = result.data.rows[0].elements.map(e => {
                return e.distance.value
            })
            //the maps will print out the distances in the same order that was entered. So the theater that is closet to the user will be at theaters[indexOfShortestDistance]
            let indexOfShortestDistance = distances.indexOf(Math.min.apply(Math, distances))

            Theater.find({ _id: theaters[indexOfShortestDistance][0]._id })
                .populate({
                    path: 'movies',
                    match: { name: movie }
                })
                .then(theater => res.json(theater))
                .catch(err => {
                    res.status(400).json('Error: ' + err)
                })
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
}
/*=====  End of Helper Functions  ======*/



/*=============================================
=            Routes            =
=============================================*/
//scrape route to get moive theater and associated movies 
router.route('/scrape').get((req, res) => {
    //searches each theater and then the provided dates
    // theaters.forEach(theater => {
    //     // getMovieInfo(theater, dates)
    //     dates.forEach(date => {
    //         getMovieInfo(theater, date)
    //     })
    // })
    // addDataToDB(test1, res, genres)
    addDataToDB(test1, res, genres)

})

//route to randomly get movie by genre 
//:genre is case sensitve 
router.route('/get_movies/:genre').get((req, res) => {
    Movie.find({ genres: { $in: [req.params.genre] } })
        .then(movies => {
            //find and remove duplicates
            let filtered = []

            for (let i = 0; i < movies.length; i++) {
                filtered.push(movies[i])
                let remove = movies[i].name
                movies = movies.filter(e => e.name !== remove)
            }

            //now randomly return one item in the array 
            const randomNumber = Math.floor(Math.random() * filtered.length - 1)

            res.json(filtered[randomNumber])
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
})

//after user chooses the movie they would like to see, find the showing that is closest to them
//make sure to get the ID of the movie document after they hit the card?
router.route('/get_movie_theater').get((req, res) => {
    const { movie, location } = req.body

    Movie.find({ name: { $in: movie } })
        .then(movies => {
            //now pull the associated theaters 
            let availableTheaters = []
            let movieCount = movies.length
            let count = 0
            movies.forEach(mov => {
                Theater.find({ movies: mov._id })
                    .then(theater => {
                        count++
                        availableTheaters.push(theater)
                        if (count === movieCount) {
                            findClosestTheater(availableTheaters, location, res, movie)
                        }
                    })
                    .catch(err => {
                        res.status(400).json('Error: ' + err)
                    })
            })
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
})



/*=====  End of Routes  ======*/

// Export routes for server.js to use.
module.exports = router;



/*=============================================
=            Todays focus            =
=============================================*/
/*
Current Issues:
-Extra data (genre, description, etc.) not always loaded when creating movie entries

TODO:
-test this using a nightmare call to populate the db with data 
    -make sure each local theater works with the scrape function 


*/
/*=====  End of Todays focus  ======*/






