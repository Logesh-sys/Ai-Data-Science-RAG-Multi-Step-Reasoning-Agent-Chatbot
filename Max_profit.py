def max_profit(n):
    # Property attributes: (Name, build_time, earnings_per_unit_time)
    properties = [
        ('T', 5, 1500),
        ('P', 4, 1000),
        ('C', 10, 2000)
    ]
    
    # Memoization table to store max profit for a given remaining time t
    memo = {}

    def solve(time_left):
        if time_left <= 0:
            return 0, {'T': 0, 'P': 0, 'C': 0}
        
        if time_left in memo:
            return memo[time_left]
        
        max_earn = 0
        best_counts = {'T': 0, 'P': 0, 'C': 0}
        
        for name, b_time, e_rate in properties:
            if time_left >= b_time:
                # Time the property is operational = Total time (n) - completion time
                # To calculate operational time correctly in a recursive choice:
                # If we build this property taking b_time, it runs for (time_left - b_time) 
                # plus any recursive sub-solutions. 
                # More precisely, total earnings from this building = e_rate * (time_left - b_time)
                # plus the max profit achievable in the remaining (time_left - b_time) time.
                operational_time = time_left - b_time
                current_earnings = operational_time * e_rate
                
                sub_earn, sub_counts = solve(operational_time)
                
                total_earn = current_earnings + sub_earn
                
                if total_earn > max_earn:
                    max_earn = total_earn
                    best_counts = sub_counts.copy()
                    best_counts[name] += 1
                    
        memo[time_left] = (max_earn, best_counts)
        return max_earn, best_counts

    earnings, counts = solve(n)
    return earnings, counts

# Test Case Verification
test_cases = [7, 8, 13]
for tc in test_cases:
    earn, counts = max_profit(tc)
    print(f"Time Unit: {tc}")
    print(f"Earnings: ${earn}")
    print(f"Output -> T: {counts['T']} P: {counts['P']} C: {counts['C']}")
    print("-" * 30)