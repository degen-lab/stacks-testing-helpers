(define-data-var test-uint uint u100)
(define-data-var test-int int 1000)
(define-data-var test-list  (list 4000 { signer: principal, num-slots: uint }) (list))
(define-data-var test-bool-true bool true)
(define-data-var test-string-ascii (string-ascii 30) "initial value")
(define-data-var test-string-utf8 (string-utf8 50) u"initial value")
(define-data-var test-response-ok (response uint int) (ok u100))
(define-data-var test-response-err (response uint int) (err -1))
(define-data-var test-principal principal 'ST000000000000000000002AMW42H.pox-4)



(define-public (set-list 
                (list-m (list 4000 { signer:principal, num-slots:uint })))
    (begin 
        (ok (var-set test-list list-m))
    )
)