const removeLineBreaks = (content) => {
  return content.replace(/(\r\n|\n|\r)/gm, '');
};

const checkCssPropertyInLayout = (className, viewportWidth, viewportHeight, property, value) => {
  cy.viewport(viewportWidth, viewportHeight);
  cy.visit('./index.html');
  cy.document().then((doc) => {
    const e = doc.createElement('div');
    e.className = className;
    doc.body.appendChild(e);
    cy.get(`div.${className}`)
      .should('exist')
      .should('have.css', property, value);
  });
};

const checkCssExistPropertyInOrientation = (className, preset, orientation, property, value) => {
  cy.viewport(preset, orientation);
  cy.visit('./index.html');
  cy.document().then((doc) => {
    const e = doc.createElement('div');
    e.className = className;
    doc.body.appendChild(e);
    cy.get(`div.${className}`)
      .should('exist')
      .should('have.css', property, value);
  });
};

const checkCssNotExistPropertyInOrientation = (className, preset, orientation, property, value) => {
  cy.viewport(preset, orientation);
  cy.visit('./index.html');
  cy.document().then((doc) => {
    const e = doc.createElement('div');
    e.className = className;
    doc.body.appendChild(e);
    cy.get(`div.${className}`)
      .should('exist')
      .should('not.have.css', property, value);
  });
};

describe('Daily Prophet', () => {

  it('Sua página deve usar os elementos semânticos do _HTML_ de forma correta. Sua página deve conter os elementos: `header`, `nav`, `aside`, `article`, `section`, `footer`, `img`, `a`', () => {
    cy.visit('./index.html');
    const elements = [
      'header',
      'nav',
      'aside',
      'article',
      'section',
      'footer',
      'img',
      'a'
    ];

    elements.forEach((element) => {
      cy.get(element).should('exist');
    });
  });

  it('Sua página deve passar no validador de acessibilidade AChecker', () => {
    cy.readFile('./index.html').then((content) => {
      cy.visit('https://achecker.ca/checker/index.php');
      cy.contains('Paste HTML Markup').click();
      cy.get('textarea').type(content);
      cy.get('#validate_paste').click();
      cy.contains('Congratulations! No known problems.');
    });
  });

  it('Você deve criar dois layouts: um para telas que tenham até `760px` de largura, e outro para telas que tenham no mínimo `1170px` de largura', () => {
    const className = 'container-layout';
    const backgroundColorProperty = 'background-color';
    const yellow = 'rgb(255, 255, 0)'
    const red = 'rgb(255, 0, 0)';
    const lowViewport = [500, 768];
    const minViewport = [760, 768];
    const maxViewport = [1170, 768];
    const defaultViewport = [1366, 768];

    checkCssPropertyInLayout(className, ...lowViewport, backgroundColorProperty, yellow);
    checkCssPropertyInLayout(className, ...minViewport, backgroundColorProperty, yellow);
    checkCssPropertyInLayout(className, ...maxViewport, backgroundColorProperty, red);
    checkCssPropertyInLayout(className, ...defaultViewport, backgroundColorProperty, red);
  });

  it('Você deve implementar uma regra de estilo específica para quando a orientação da tela estiver em `landscape`', () => {
    const className = 'container-orientation';
    const preset = 'iphone-6';
    const landscape = 'landscape';
    const portrait = 'portrait';
    const property = 'border';
    const value = '1px solid rgb(255, 0, 0)';

    checkCssExistPropertyInOrientation(className, preset, landscape, property, value);
    checkCssNotExistPropertyInOrientation(className, preset, portrait, property, value);
  });

  it('Faça a animação de alguma coisa voando pela tela', () => {
    cy.visit('./index.html');
    cy.get('.fly')
      .should('have.css', 'animation-name', 'flying')
      .should('have.css', 'animation-delay', '3s')
      .should('have.css', 'animation-iteration-count', '3')
      .should('have.css', 'animation-direction', 'alternate')
      .should('have.css', 'animation-fill-mode', 'forwards')
      .should('have.css', 'animation-play-state', 'running');
  });

  it('Você deve utilizar a transformação `skew`', () => {
    cy.readFile('./style.css').then((content) => {
      expect(removeLineBreaks(content)).to.match(/@keyframes\s.+\s{.+(skew).+}/);
    });
  });

  it('Você deve utilizar a transformação `scale`', () => {
    cy.readFile('./style.css').then((content) => {
      expect(removeLineBreaks(content)).to.match(/@keyframes\s.+\s{.+(scale).+}/);
    });
  });

  it('Você deve utilizar a transformação `translate`', () => {
    cy.readFile('./style.css').then((content) => {
      expect(removeLineBreaks(content)).to.match(/@keyframes\s.+\s{.+(translate).+}/);
    });
  });

  it('Você deve utilizar `transitions` para suavizar alterações de estilo entre seus elementos', () => {
    cy.readFile('./style.css').then((content) => {
      expect(removeLineBreaks(content)).to.match(/transition/);
    });
  });

  it('Ao clicar em um artigo, ele deve crescer em 50% ao longo de 4 segundos, e sua fonte deve ir ficando gradativamente mais em negrito durante essa transição', () => {
    cy.visit('./index.html');
    cy.get('.article-animation')
      .should('have.css', 'animation-name', 'article-grow')
      .should('have.css', 'animation-duration', '4s')
      .should('have.css', 'animation-play-state', 'paused')
  });

  it('Você deve utilizar `steps` para que as transições entre as etapas da sua animação sejam discretas', () => {
    cy.readFile('./style.css').then((content) => {
      expect(removeLineBreaks(content)).to.match(/steps/);
    });
  });
});
