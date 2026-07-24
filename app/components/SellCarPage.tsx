"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { FormEvent } from "react";
import { Header } from "./AventoSite";

const documents = [
  ["Паспорт транспортного засобу", true, true],
  ["Свідоцтво про реєстрацію автомобіля", true, false],
  ["Паспорт власника", true, true],
  ["Генеральна довіреність (за потреби)", true, true],
  ["Усі комплекти ключів", true, true],
  ["Талон технічного огляду", "Бажано", "Бажано"],
  ["Документи сервісного обслуговування", "Бажано", "Бажано"],
] as const;

const steps = [
  ["/buyout/step-keys.png", "Передаєте свій автомобіль", "Надаєте автомобіль і необхідні документи. Усе інше — від оцінки до оформлення договору — виконають наші спеціалісти. Ви заощаджуєте час, кошти й нерви."],
  ["/buyout/step-inspection.png", "Оцінюємо ваш автомобіль", "У найкоротші строки проведемо професійну оцінку. Увесь процес від надання автомобіля до отримання коштів може зайняти до однієї години."],
  ["/buyout/step-price.png", "Пропонуємо найкращу ціну", "Враховуємо стан автомобіля та пропонуємо до 97% його ринкової вартості."],
  ["/buyout/step-contract.png", "Юридично оформлюємо угоду", "Забезпечуємо надійне оформлення з підписанням договору та оперативним отриманням коштів."],
] as const;

function DocumentState({ value }: { value: boolean | "Бажано" }) {
  return value === true ? <span className="document-required" aria-label="Потрібен">+</span> : <span className="document-optional">Бажано</span>;
}

export function SellCarPage() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="site-frame">
      <Header />
      <main className="buyout-page section-shell">
        <section className="buyout-intro">
          <div>
            <h1>Викуп авто</h1>
            <p>Оцінимо ваше авто за 20 хвилин</p>
          </div>
          {submitted ? (
            <div className="buyout-success" role="status"><strong>Заявку прийнято</strong><span>Ми зв’яжемося з вами для оцінки автомобіля.</span></div>
          ) : (
            <form className="buyout-form" onSubmit={onSubmit}>
              <label>Ім’я<input name="name" autoComplete="name" required /></label>
              <label>Номер телефону<input name="phone" type="tel" autoComplete="tel" placeholder="+380" required /></label>
              <button className="buyout-submit" type="submit">Надіслати заявку</button>
            </form>
          )}
        </section>

        <section className="buyout-documents-section">
          <h2>Необхідні документи</h2>
          <div className="buyout-documents" role="table" aria-label="Необхідні документи">
            <div className="buyout-document-row buyout-document-head" role="row"><span role="columnheader">Документ</span><span role="columnheader">Авто на обліку</span><span role="columnheader">Авто знято з обліку</span></div>
            {documents.map(([name, registered, unregistered]) => <div className="buyout-document-row" role="row" key={name}><span role="cell">{name}</span><span role="cell"><DocumentState value={registered} /></span><span role="cell"><DocumentState value={unregistered} /></span></div>)}
          </div>
        </section>

        <section className="buyout-process">
          <h2>Як це працює</h2>
          <div className="buyout-steps">
            {steps.map(([image, title, text]) => <article key={title}><img src={image} alt="" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>
      </main>
      <footer><strong>Avento Motors</strong><span>Продаж автомобілів · кредит · обмін · резерв</span><span>© 2026</span></footer>
    </div>
  );
}
