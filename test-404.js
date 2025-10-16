// 404 페이지 테스트 스크립트
const testUrls = [
    // 정상 작동해야 하는 경로
    { url: '/', expected: 'MainPage', description: '홈페이지' },
    { url: '/lemma-2.70', expected: 'Lemma270', description: 'Lemma 2.70' },
    { url: '/theorem-2.28', expected: 'Theorem228', description: 'Theorem 2.28' },
    
    // 404가 발생해야 하는 경로
    { url: '/존재하지않는경로', expected: '404', description: '존재하지 않는 경로' },
    { url: '/random-page', expected: '404', description: 'Random Page' },
    { url: '/test/404', expected: '404', description: 'Test 404' }
];

async function test404() {
    console.log('🧪 404 페이지 테스트 시작...\n');
    
    for (const test of testUrls) {
        try {
            console.log(`테스트: ${test.description} (${test.url})`);
            
            const response = await fetch(test.url);
            console.log(`  상태 코드: ${response.status}`);
            
            if (test.expected === '404') {
                if (response.status === 404) {
                    console.log('  ✅ 404 응답 정상');
                } else {
                    console.log('  ❌ 404 응답 예상했지만 다른 상태 코드');
                }
            } else {
                if (response.status === 200) {
                    console.log('  ✅ 200 응답 정상');
                } else {
                    console.log('  ❌ 200 응답 예상했지만 다른 상태 코드');
                }
            }
            
        } catch (error) {
            console.log(`  ❌ 오류: ${error.message}`);
        }
        
        console.log('');
    }
    
    console.log('🎯 테스트 완료!');
}

// 브라우저에서 실행
if (typeof window !== 'undefined') {
    test404();
} else {
    console.log('Node.js 환경에서는 실행할 수 없습니다. 브라우저에서 실행하세요.');
}
