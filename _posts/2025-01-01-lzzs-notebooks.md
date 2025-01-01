---
layout: post
title: 【课程笔记】
date: 2025-01-01 11:00 +0800
description: 对于公开课程学习的知识整理与总结，笔记内容涵盖硬件设计、计算机架构、操作系统、编程语言等主题。笔记以课程为单位，记录关键知识点与学习进度，为后续复习和深入学习提供支持。
categories: [课程笔记]
tags: [笔记]
pin: true
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Cards</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: white;
      margin: 0;
      padding: 20px;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: space-between;
    }
    .card {
      background-color:#1F1F1F;
      padding: 15px;
      border-radius: 8px;
      flex: 1 1 calc(50% - 16px);
      box-sizing: border-box;
      min-width: 300px;
    }
    .card h3 {
      margin: 0;
      font-size: 18px;
    }
    .card h3 a {
      text-decoration: none;
      color: #ffffff;
    }
    .card p {
      margin: 5px 0;
      font-size: 14px;
      color: #cccccc;
    }
    .statusDone {
      background-color:rgb(95, 141, 186);
      color: black;
      padding: 2px 6px;
      border-radius: 50%;
      font-size: 12px;
    }
    .statusStarted{
      background-color:rgb(186, 153, 95);
      color: black;
      padding: 2px 6px;
      border-radius: 50%;
      font-size: 12px;
    }
    .statusDoing{
      background-color:rgb(95, 186, 118);
      color: black;
      padding: 2px 6px;
      border-radius: 50%;
      font-size: 12px;
    }

  </style>
</head>
<body>
  <div class="container" id="card-container"></div>

  <script>
    // JSON 配置数据
    const coursesDone = [
  {
    "title": "HDLbits Verilog",
    "link": "https://lzzs.fun/HDLbits-Verilog-Notebook/",
    "date": "2024-10",
    "status": "Paused",
    "description": "HDLBits 是使用 Verilog 硬件描述语言进行数字硬件设计的小型电路设计练习集。本笔记是练习后的记录，用于回顾和复习。"
  },
  {
    "title": "DDCA",
    "link": "https://lzzs.fun/DDCA/",
    "date": "2024-10",
    "status": "Paused",
    "description": "Digital Design and Computer Architecture: RISC-V Edition chapter 1-5 数字设计和计算机体系结构：RISC-V版"
  },
  {
    "title": "CS 61A",
    "link": "https://lzzs.fun/CS61A-notebook/",
    "date": "2024-09",
    "status": "Paused",
    "description": "UC Berkeley CS 61A: Structure and Interpretation of Computer Programs Fall 2020 计算机程序的构造和解释"
  },
  {
    "title": "CS 61C",
    "link": "https://lzzs.fun/CS61C-notebook/",
    "date": "2024-08",
    "status": "Drafted",
    "description": "UC Berkeley CS 61C: Great Ideas in Computer Architecture (Machine Structures) Fall 2022 计算机体系结构中的伟大思想"
  },
  {
    "title": "MIT 6.S081",
    "link": "https://lzzs.fun/6.S081-notebook/",
    "date": "2024-08",
    "status": "Paused",
    "description": "MIT 6.S081: Introduction to Operating Systems Fall 2020 操作系统"
  },
  {
    "title": "MIT 6.004",
    "link": "https://lzzs.fun/MIT-digital-systems/",
    "date": "2024-05",
    "status": "Paused",
    "description": "MIT 6.004: Computation Structures Spring 2019 计算结构"
  }
    ];

    const coursesDoing = [
   {
    "title": "CSE 228A",
    "link": "https://lzzs.fun/CSE228A-notebook/",
    "date": "2024-12",
    "status": "Ongoing",
    "description": "UC Santa Cruz CSE 228A: Agile Hardware Design Winter 2023 敏捷硬件设计"
  },
  {
    "title": "Digital Design with Chisel",
    "link": "https://lzzs.fun/chisel-book-note/",
    "date": "2024-12",
    "status": "Ongoing",
    "description": "Digital Design with Chisel Fifth Edition (2023) by Martin Schoeberl 使用Chisel进行数字设计"
  },
];

     const coursesStarted = [
   {
    "title": "EECS 151/251A",
    "link": "https://lzzs.fun/EECS151-notebook/",
    "date": "2024-09",
    "status": "Started",
    "description": "UC Berkeley EECS 151/251A: Introduction to Digital Deisgn and Integrated Circuits Spring 2022 数字设计和集成电路导论"
  },
  {
    "title": "CS 152/252A",
    "link": "https://lzzs.fun/CS152-notebook/",
    "date": "2024-09",
    "status": "Started",
    "description": "UC Berkeley CS 152/252A: Computer Architecture and Engineering Spring 2023 计算机体系结构与工程"
  },
];

    // 获取容器元素
    const container = document.getElementById('card-container');

    // 动态生成 HTML 内容
    coursesDone.forEach(course => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3><a href="${course.link}" target="_blank">🔗 ${course.title}</a></h3>
        <p>${course.date}</p>
        <p>
          <span class="statusDone">${course.status}</span>
          ${course.description}
        </p>
      `;
      container.appendChild(card);
    });
     coursesDoing.forEach(course => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3><a href="${course.link}" target="_blank">🔗 ${course.title}</a></h3>
        <p>${course.date}</p>
        <p>
          <span class="statusDoing">${course.status}</span>
          ${course.description}
        </p>
      `;
      container.appendChild(card);
    });
    coursesStarted.forEach(course => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3><a href="${course.link}" target="_blank">🔗 ${course.title}</a></h3>
        <p>${course.date}</p>
        <p>
          <span class="statusStarted">${course.status}</span>
          ${course.description}
        </p>
      `;
      container.appendChild(card);
    });
  </script>
</body>
</html>
