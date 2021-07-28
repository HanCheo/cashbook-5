// 형제 노드 배열 반환해주는 함수
export const sibling = (e: Element) => [...e.parentNode!.children].filter((child: Element) => child != e);


// ``리터럴 문법 앞에 쓰면 문자열이 html태그 형태로 파싱됨
export const html = (str: TemplateStringsArray, ...args: unknown[]) =>
  str.map((s, i) => `${s}${args[i] || ''}`).join('');
