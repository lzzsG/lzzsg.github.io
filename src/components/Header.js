// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher'
import RecursiveBoxes from '../components/iconBox.js';

import { ReactComponent as TranslateIcon } from '../assets/svg/trasnlate.svg';
import { ReactComponent as HomeIcon } from '../assets/svg/home.svg';
import { ReactComponent as AboutIcon } from '../assets/svg/about.svg';
import { ReactComponent as RustIcon } from '../assets/svg/rust.svg';
import { ReactComponent as AboutMeIcon } from '../assets/svg/about-me.svg';
import { ReactComponent as TestIcon } from '../assets/svg/test.svg';
import { ReactComponent as BlogIcon } from '../assets/svg/blog.svg';
import { ReactComponent as GithubIcon } from '../assets/svg/github.svg';



const Header = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const location = useLocation();
    const [theme, setTheme] = useState('default');
    const [showNav, setShowNav] = useState(window.innerWidth <= 640);
    const currentLang = i18n.language;
    let { lang } = useParams();
    let navigate = useNavigate();

    // 判断当前选中的导航项
    const isActive = (path) => {
        // 移除语言前缀以进行比较
        const currentPath = location.pathname.replace(/^\/(en|zh)\//, '/');
        return currentPath === path;
    };


    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLang);

        // 更新路由以反映新的语言
        let newPath = location.pathname;
        // 检查是否是根路径或已经是目标语言的路径
        if (newPath === '/' || newPath === '/zh' || newPath === '/en') {
            newPath = `/${newLang}`;
        } else if (newPath.startsWith('/en/')) {
            newPath = newPath.replace('/en/', `/${newLang}/`);
        } else if (newPath.startsWith('/zh/')) {
            newPath = newPath.replace('/zh/', `/${newLang}/`);
        } else {
            // 对于不包含语言前缀的其他路径，添加新语言前缀
            // newPath = `/${newLang}${newPath}`;
        }

        navigate(newPath, { replace: true });
    };

    useEffect(() => {
        if (lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }
    }, [lang, i18n]);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth <= 640) {
                setShowNav(true); // 在sm以下尺寸始终显示导航
            } else {
                setShowNav(window.scrollY > 48); // 在大屏上滚动一定距离后显示
            }
        };

        // 监听窗口大小变化，以适应屏幕旋转等情况
        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setShowNav(true);
            } else {
                handleScroll(); // 重新评估是否显示导航
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <header className="flex justify-between items-center " >
            <div className="navbar justify-between items-center z-[100]  bg-base-300  hidden sm:flex rounded-none h-24 top-0 p-0
             border-b-2 border-base-100">
                <div className="flex">
                    <div className="dropdown  h-24">
                        <div tabIndex={0} role="button" className="btn btn-ghost hover:bg-base-100 w-20 h-20 m-2 flex items-center md:hidden p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content  shadow  w-24  bg-base-300 ring-2 ring-base-100 ring-inset">
                            <Link to={`/${currentLang}/`}>
                                <button className={`text-base btn h-20 w-20 btn-sm btn-ghost hover:bg-base-100 ${isActive('/') ? 'bg-base-100' : ''}`}>
                                    <div className="flex items-center">
                                        <HomeIcon className="-ml-0.5 mx-0.5" />
                                        {t('home')}
                                    </div>
                                </button>
                            </Link>
                            <Link to={`/${currentLang}/about`}>
                                <button className={`text-base btn h-20 w-20 mt-2 btn-sm btn-ghost hover:bg-base-100 ${isActive('/about') ? 'bg-base-100' : ''}`}>
                                    <div className="flex items-center">
                                        <AboutMeIcon className="-ml-0.5 mx-0.5" />
                                        {t('about')}
                                    </div>
                                </button>
                            </Link>
                            <Link to={`/${currentLang}/blog`}>
                                <button className={`text-base btn h-20 w-20 mt-2 btn-sm btn-ghost hover:bg-base-100 ${isActive('/blog') ? 'bg-base-100' : ''}`}>
                                    <div className="flex items-center">
                                        <BlogIcon className="-ml-0.5 mx-0.5" />
                                        {t('blog')}
                                    </div>
                                </button>
                            </Link>
                            <Link to={`/${currentLang}/test`}>
                                <button className={`text-base btn h-20 w-20 mt-2 btn-sm btn-ghost hover:bg-base-100 ${isActive('/test') ? 'bg-base-100' : ''}`}>
                                    <div className="flex items-center">
                                        <TestIcon className="-ml-0.5 mx-0.5" />
                                        {t('test')}
                                    </div>
                                </button>
                            </Link>

                        </ul>
                    </div>
                    <Link to={`/${currentLang}/`}>
                        <div className="justify-between items-center flex h-24 w-48">
                            <div className="justify-center items-center flex h-24 w-24">

                                <RecursiveBoxes size={60} />
                            </div>

                            <div className="justify-center items-center flex h-24 w-24">
                                {/* <RustIcon className="hidden md:flex px-6 -ml-5 w-24 h-24 animate-spin" /> */}

                                <div className="flex-col ">
                                    <a className="text-lg font-bold w-24 flex justify-center content-center">{t('siteName')}</a>
                                    <a className="text-sm font-bold w-24  flex justify-center content-center">temp</a>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <div className=" hidden md:flex">

                        <Link to={`/${currentLang}/`}>
                            <button className={`text-base btn h-24 w-24 btn-sm btn-ghost hover:bg-base-100 ${isActive('/') ? 'bg-base-100' : ''}`}>
                                <div className="flex items-center">
                                    <HomeIcon className="-ml-0.5 mx-0.5" />
                                    {t('home')}
                                </div>
                            </button>
                        </Link>
                        <Link to={`/${currentLang}/about`}>
                            <button className={`text-base btn h-24 w-24 btn-sm btn-ghost hover:bg-base-100 ${isActive('/about') ? 'bg-base-100' : ''}`}>
                                <div className="flex items-center">
                                    <AboutMeIcon className="-ml-0.5" />
                                    {t('about')}
                                </div>
                            </button>
                        </Link>
                        <Link to={`/${currentLang}/blog`}>
                            <button className={`text-base btn h-24 w-24 btn-sm btn-ghost hover:bg-base-100 ${isActive('/blog') ? 'bg-base-100' : ''}`}>
                                <div className="flex items-center">
                                    <BlogIcon className="-ml-0.5 mx-0.5" />
                                    {t('blog')}
                                </div>
                            </button>
                        </Link>
                        <Link to={`/${currentLang}/test`}>
                            <button className={`text-base btn h-24 w-24 btn-sm btn-ghost hover:bg-base-100 ${isActive('/test') ? 'bg-base-100' : ''}`}>
                                <div className="flex items-center">
                                    <TestIcon className="-ml-0.5 mx-0.5" />
                                    {t('test')}
                                </div>
                            </button>
                        </Link>
                    </div >
                </div >
                <div className="">

                    <div className="bg-base-300 -translate-y-0.5">
                        <button className="text-base btn h-24 w-24 btn-sm 
                            btn-ghost translate-y-0.5" onClick={toggleLanguage}>
                            <div className="flex items-center">
                                <TranslateIcon className="-ml-0.5 mx-0.5" />
                                {i18n.language === 'en' ? '中文' : 'English'}
                            </div>
                        </button>
                    </div>
                    <ThemeSwitcher />
                </div>
            </div >

            <div className="block sm:hidden fixed bottom-0 w-full h-12 bg-base-200 border-t-2 border-base-100 z-30 flex justify-center items-center text-2xl">
                <Link to={`/${currentLang}/`}>
                    {t('siteName')}
                </Link>
                <a className="tooltip ml-1" data-tip="GitHub: LzzsG" href="https://github.com/lzzsG" target="_blank" rel="noopener noreferrer"><GithubIcon className="size-6" /></a>
            </div >

            <div className={`mynavbar block z-30 fixed top-0 w-full flex justify-center items-center bg-base-200 border-b-2 border-base-100 ${showNav ? 'opacity-100' : 'opacity-0'}`}>
                <Link to={`/${currentLang}/`}>
                    <button className="hidden sm:inline text-sm font-bold mr-2">
                        LzzsSite
                    </button>
                    <button className={`text-sm btn  h-12 w-12   p-0 pb-0.5 btn-sm btn-ghost  hover:bg-base-100 ${isActive('/') ? 'bg-base-100' : ''}`}>
                        <div className="flex items-center  ">
                            <HomeIcon className="" />
                        </div>
                    </button>
                </Link>
                <Link to={`/${currentLang}/about`}>
                    <button className={`text-sm btn h-12 w-16 p-0 m-0 btn-sm btn-ghost  hover:bg-base-100 ${isActive('/about') ? 'bg-base-100' : ''}`}>
                        <div className="flex items-center">
                            {t('about')}
                        </div>
                    </button>
                </Link >

                <Link to={`/${currentLang}/blog`}>
                    <button className={`text-sm btn h-12 w-16 p-0 m-0 btn-sm btn-ghost hover:bg-base-100 ${isActive('/blog') ? 'bg-base-100' : ''}`}>
                        <div className="flex items-center">
                            {t('blog')}
                        </div>
                    </button>
                </Link >
                <Link to={`/${currentLang}/test`}>
                    <button className={`text-sm btn h-12 w-16 p-0 m-0 btn-sm btn-ghost hover:bg-base-100 ${isActive('/test') ? 'bg-base-100' : ''}`}>
                        <div className="flex items-center">

                            {t('test')}
                        </div>
                    </button>
                </Link >
                <button className="text-sm btn h-12 w-12  btn-sm 
                            btn-ghost" onClick={toggleLanguage}>
                    <div className="flex items-center ">
                        <TranslateIcon className="translate-y-px" />
                    </div>
                </button>
                <button className="-translate-y-0.5" >
                    <input className="btn btn-xs ml-2 px-2  bg-base-200" name="radio-sm-them" type="radio" checked={theme === 'black'} aria-label={'☽'} onClick={() => changeTheme('black')} />
                    <input className="btn btn-xs px-2  bg-base-200" name="radio-sm-them" type="radio" checked={theme === 'light'} aria-label={'☼'} onClick={() => changeTheme('light')} />
                </button>
            </div >
        </header >
    );
};

export default Header;